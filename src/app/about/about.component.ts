import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  constructor() { }

  onSpigotMCButtonClick() {
    window.open("https://www.spigotmc.org/resources/authors/mrtigreroux.225451/");
  }

  onGitHubButtonClick() {
    window.open("https://github.com/MrTigreroux");
  }

}
