import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadComponent } from './components/upload/upload.component';
import { ExcelManagerComponent } from './components/excel-manager/excel-manager.component';
import { UploadXmlComponent } from './components/upload-xml/upload-xml.component';
import { EmailConfigComponent } from './components/email-config/email-config.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HelpComponent } from './components/help/help.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UploadComponent,
    UploadXmlComponent,
    ExcelManagerComponent,
    EmailConfigComponent,
    NavbarComponent,
    FooterComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
