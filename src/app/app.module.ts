import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { RippleModule } from 'primeng/ripple';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes } from '@angular/router';
import { PluginComponent } from './plugin/plugin.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { PluginMessagesUpdaterComponent } from './plugin-messages-updater/plugin-messages-updater.component';
import { PluginTitleComponent } from './plugin-title/plugin-title.component';
import { LanguageService } from './services/language.service';

const appRoutes: Routes = [
  { path: "plugins/tigerreports", component: PluginComponent, data: { name: "TigerReports" } },
  { path: "plugins/tigerreportssupports", component: PluginComponent, data: { name: "TigerReportsSupports" } },
  { path: "about", component: AboutComponent },
  { path: "**", redirectTo: "/about" }
];

@NgModule({
  declarations: [
    AppComponent,
    LanguageSelectorComponent,
    PluginComponent,
    PluginMessagesUpdaterComponent,
    PluginTitleComponent,
    NavbarComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TabMenuModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    SelectButtonModule,
    InputTextareaModule,
    RippleModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    ClipboardModule,
  ],
  providers: [LanguageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
