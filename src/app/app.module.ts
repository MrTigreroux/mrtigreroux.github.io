import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { PluginComponent } from './plugin/plugin.component';

const appRoutes: Routes = [
  { path: "plugins/tigerreports", component: PluginComponent, data: { name: "TigerReports" } },
  { path: "about", component: AboutComponent },
  { path: "**", redirectTo: "/about" }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabMenuModule,
    DropdownModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
