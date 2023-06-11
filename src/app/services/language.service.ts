import { Injectable } from '@angular/core';

export interface Language {
  name: string,
  code: string,
  english: string
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public static readonly LANGUAGES: { [languageEnglishName: string]: Language } = {
    "english": { name: 'English', code: 'GB', english: 'english' },
    "french": { name: 'Français', code: 'FR', english: 'french' },
    "spanish": { name: 'Español', code: 'ES', english: 'spanish' },
    "chinese": { name: '中文', code: 'CN', english: 'chinese' },
    "russian": { name: 'Русский', code: 'RU', english: 'russian' },
    "vietnamese": { name: 'Tiếng Việt', code: 'VN', english: 'vietnamese' },
    "dutch": { name: 'Nederlands', code: 'NL', english: 'dutch' },
    "german": { name: 'Deutsch', code: 'DE', english: 'german' },
    "polish": { name: 'Polskie', code: 'PL', english: 'polish' },
    "italian": { name: 'Italiano', code: 'IT', english: 'italian' }
  }

  selectedLanguage: Language;

  languages: Language[];

  constructor() {
    this.languages = Object.values(LanguageService.LANGUAGES);
    this.selectedLanguage = this.languages[0];
  }

  public isFrench(): boolean {
    return this.selectedLanguage.code === 'FR';
  }

  public setAvailableLanguages(languagesName: string[]) {
    let newLanguages: Language[] = [];
    for (let langName of languagesName) {
      let lang = LanguageService.LANGUAGES[langName];
      if (!lang) {
        console.log("LanguageService.setAvailableLanguages(): unknown language " + langName);
      } else {
        newLanguages.push(lang);
      }
    }

    this.setLanguages(newLanguages);
  }

  setLanguages(newLanguages: Language[]) {
    if (!newLanguages || newLanguages.length <= 0) {
      console.log("LanguageService.setLanguages(): invalid newLanguages");
      return;
    }
    this.languages = newLanguages;
    for (let lang of this.languages) {
      if (this.selectedLanguage === lang) {
        return;
      }
    }
    this.selectedLanguage = this.languages[0];
  }

}
