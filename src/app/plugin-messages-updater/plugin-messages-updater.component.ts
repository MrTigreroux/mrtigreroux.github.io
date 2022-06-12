import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil, tap, timeout } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { Clipboard } from '@angular/cdk/clipboard';

interface ExtractedMessages {
  [msgPath: string]: { message: string, modified: boolean }
}

enum UpdatedMessageType {
  KEPT = "KEPT",
  MODIFIED = "MODIFIED",
  NEW = "NEW"
}

interface UpdatedMessageLine {
  key: string, message: string, type: UpdatedMessageType
}

interface MessageLine {
  key: string,
  message: string
}

@Component({
  selector: 'app-plugin-messages-updater',
  templateUrl: './plugin-messages-updater.component.html',
  styleUrls: ['./plugin-messages-updater.component.scss']
})
export class PluginMessagesUpdaterComponent implements OnChanges, OnDestroy {

  UpdatedMessageType = UpdatedMessageType;

  @Input() pluginName: string = "UNKNOWN PLUGIN";
  @Input() defaultMessagesWebLink!: string;

  messagesInput: string = "";
  defaultMessagesWebRequest: Observable<string> | undefined;
  defaultMessages: ExtractedMessages | undefined;

  @ViewChild('updateResultDiv') private updateResultDiv!: ElementRef;
  updatedMessages: UpdatedMessageLine[] | undefined;
  removedMessages: MessageLine[] | undefined;

  private destroy$ = new Subject();

  constructor(public languageService: LanguageService, private http: HttpClient, private clipboard: Clipboard) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultMessagesWebLink'].currentValue !== changes['defaultMessagesWebLink'].previousValue) {
      this.defaultMessages = undefined;
      this.updatedMessages = undefined;
      this.defaultMessagesWebRequest = undefined;
      this.removedMessages = undefined;
    }
  }

  collectDefaultMessages() {
    if (!this.defaultMessages) {
      console.log("Collecting default messages...");
      this.defaultMessagesWebRequest = this.getTextFile(this.defaultMessagesWebLink);
      this.defaultMessagesWebRequest.subscribe(webResult => { this.processDefaultMessagesWebResult(webResult) });
    }
  }

  processDefaultMessagesWebResult(webResult: string) {
    this.defaultMessages = this.extractMessages(webResult, false);
  }

  getTextFile(url: string) {
    return this.http.get(url, { responseType: 'text' })
      .pipe(takeUntil(this.destroy$),
        tap(
          {
            next: (data) => data,
            error: (error) => console.log("Error when getting text file from " + url + ": " + error)
          }
        )
      );
  }

  onUpdateMessagesButtonClick() {
    this.collectDefaultMessages();

    if (!this.defaultMessages) {
      this.defaultMessagesWebRequest!.subscribe(webResult => {
        this.processDefaultMessagesWebResult(webResult);
        this.generateUpdatedMessages();
      });
    } else {
      this.generateUpdatedMessages();
    }
  }

  scrollToElement(element: ElementRef): void {
    element.nativeElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  generateUpdatedMessages() {
    if (this.defaultMessages) {
      this.updatedMessages = this.getUpdatedMessages(this.extractMessages(this.messagesInput, true), this.defaultMessages);
      this.removedMessages = this.getRemovedMessages(this.extractMessages(this.messagesInput, false), this.defaultMessages);
      // console.log("updatedMsgs: ");
      // for (let path in this.updatedMessages) {
      //   console.log(path + " -> " + this.updatedMessages[path].type + " - " + this.updatedMessages[path].message.substring(0, 8) + "...");
      // }
      setTimeout(() => this.scrollToElement(this.updateResultDiv), 100);
    }
  }

  getUpdatedMessages(messages: ExtractedMessages, defaultMessages: ExtractedMessages): UpdatedMessageLine[] {
    let result: UpdatedMessageLine[] = [];

    for (let msgPath in defaultMessages) {
      let inputMsg = messages[msgPath];
      if (inputMsg) {
        result.push({ key: PluginMessagesUpdaterComponent.getKeyFromPath(msgPath), message: inputMsg.message, type: inputMsg.modified ? UpdatedMessageType.MODIFIED : UpdatedMessageType.KEPT });
      } else {
        result.push({ key: PluginMessagesUpdaterComponent.getKeyFromPath(msgPath), message: defaultMessages[msgPath].message, type: UpdatedMessageType.NEW });
      }
    }

    return result;
  }

  getRemovedMessages(messages: ExtractedMessages, defaultMessages: ExtractedMessages): MessageLine[] {
    let result: MessageLine[] = [];

    for (let msgPath in messages) {
      if (!defaultMessages[msgPath]) {
        result.push({ key: PluginMessagesUpdaterComponent.getKeyFromPath(msgPath), message: messages[msgPath].message });
      }
    }

    return result;
  }

  static getKeyFromPath(path: string) {
    let tokens = path.split(".");
    let result = "";
    for (let i = 1; i < tokens.length; i++) {
      result += "  ";
    }
    result += tokens[tokens.length - 1];

    return result;
  }

  static getLevel(nodeKey: string): number {
    if (!nodeKey || nodeKey.length == 0) {
      return 0;
    }
    let i = 0;
    for (i = 0; i < nodeKey.length; i++) {
      if (nodeKey.charAt(i) !== ' ') {
        break;
      }
    }
    return i / 2;
  }

  extractMessages(messages: string, modify: boolean): ExtractedMessages {
    let result: ExtractedMessages = {};

    let currentPathPrefix: string[] = [];
    let fixTigerReports = modify && this.pluginName === "TigerReports";
    let modified = false;
    for (let line of messages.split("\n")) {
      modified = false;
      if (!line) {
        continue;
      }

      let tokens = line.split(":");
      if (tokens.length < 2) { // No ":"
        continue;
      }

      let level = PluginMessagesUpdaterComponent.getLevel(tokens[0]);
      currentPathPrefix.splice(level);

      let key: string = tokens[0].trim();
      if (fixTigerReports) {
        let newKey = key.replace(/Remove/g, "Delete").replace(/remove/g, "delete").replace(/Signalman/g, "Reporter").replace(/signalman/g, "reporter");
        modified ||= key !== newKey;
        key = newKey;
      }

      let msg: string = tokens.slice(1).join(":").trim();
      if (fixTigerReports) {
        let newMsg = msg;
        if (tokens[0] === "  Report-chat-details" || tokens[0] === "  Report-details") {
          newMsg = msg.replace(/_Reporter_/g, "_Reporters_");
        }
        newMsg = newMsg.replace(/_Signalman_/g, "_Reporter_");
        modified ||= msg !== newMsg;
        msg = newMsg;
      }

      currentPathPrefix.push(key);
      result[currentPathPrefix.join(".")] = { message: msg, modified: modified };

      if (msg.length > 0 && msg.charAt(0) !== '#') { // Is not a section start
        currentPathPrefix.pop();
      }
    }

    return result;
  }

  onCopyMessagesButtonClick() {
    if (!this.updatedMessages) {
      return;
    }

    const pending = this.clipboard.beginCopy(this.getUpdatedMessagesText(this.updatedMessages));
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        pending.destroy();
      }
    };
    attempt();
  }

  getUpdatedMessagesText(messages: UpdatedMessageLine[]) {
    let result = "";
    for (let line of messages) {
      result += line.key + ":"
      if (line.message.length > 0) {
        result += " " + line.message;
      }
      result += "\n";
    }

    return result.length > 0 ? result.substring(0, result.length - 1) : result;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

}
