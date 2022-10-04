import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LanguageService } from '../services/language.service';

interface PluginsData {
  [pluginName: string]: { spigotWebLink: string, defaultMessagesLanguage: string[] }
}

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit {

  public static readonly PLUGINS_DATA: PluginsData = {
    "TigerReports": { spigotWebLink: "https://www.spigotmc.org/resources/tigerreports.25773/", defaultMessagesLanguage: ["english", "french", "spanish", "chinese", "russian", "vietnamese", "dutch", "german", "polish"] },
    "TigerReportsSupports": { spigotWebLink: "https://www.spigotmc.org/resources/tigerreportssupports.54612/", defaultMessagesLanguage: ["english", "french", "spanish", "russian"] }
  };

  @Input() name: string = "NAME NOT FOUND";
  spigotWebLink: string = "/";

  constructor(private route: ActivatedRoute, public languageService: LanguageService) { }

  ngOnInit(): void {
    this.route.data.subscribe((params: Params) => {
      this.name = params['name'];
      this.spigotWebLink = PluginComponent.PLUGINS_DATA[this.name].spigotWebLink;
      this.languageService.setAvailableLanguages(PluginComponent.PLUGINS_DATA[this.name].defaultMessagesLanguage);
    });
  }

  onDefaultMessagesButtonClick() {
    window.open(this.getDefaultMessagesWebLink());
  }

  public getDefaultMessagesWebLink(): string {
    return 'https://raw.githubusercontent.com/MrTigreroux/' + this.name + '/master/default-messages/' + this.languageService.selectedLanguage.english + '.yml';
  }

}
