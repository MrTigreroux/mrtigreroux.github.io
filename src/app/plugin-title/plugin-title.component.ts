import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plugin-title',
  templateUrl: './plugin-title.component.html',
  styleUrls: ['./plugin-title.component.scss']
})
export class PluginTitleComponent implements OnInit {

  @Input() pluginName!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
