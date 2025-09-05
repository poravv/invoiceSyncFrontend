import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UploadComponent } from './components/upload/upload.component';
import { ExcelManagerComponent } from './components/excel-manager/excel-manager.component';
import { UploadXmlComponent } from './components/upload-xml/upload-xml.component';
import { EmailConfigComponent } from './components/email-config/email-config.component';
import { HelpComponent } from './components/help/help.component';
import { InvoiceExplorerComponent } from './components/invoice-explorer/invoice-explorer.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'upload-xml', component: UploadXmlComponent },
  { path: 'excel-manager', component: ExcelManagerComponent },
  { path: 'invoice-explorer', component: InvoiceExplorerComponent },
  { path: 'email-config', component: EmailConfigComponent },
  { path: 'ayuda', component: HelpComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
