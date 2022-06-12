import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.items = [
      { label: 'TigerReports', routerLink: ['/plugins/tigerreports'] },
      { label: 'TigerReportsSupports', routerLink: ['/plugins/tigerreportssupports'] },
      { label: 'About', icon: 'pi pi-fw pi-file', routerLink: ['/about'] }
    ];
  }

}
