import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from "../services/language.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {

  constructor(public languageService: LanguageService) { }

}
