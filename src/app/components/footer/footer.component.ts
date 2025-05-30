import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-light text-center text-lg-start mt-5">
      <div class="container p-4">
        <div class="row">
          <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 class="text-uppercase">InvoiceSync</h5>
            <p>
              Automatización inteligente para la extracción de datos de facturas desde correos electrónicos.
            </p>
          </div>
          <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
            <h5 class="text-uppercase">Enlaces</h5>
            <ul class="list-unstyled mb-0">
              <li>
                <a routerLink="/" class="text-dark">Dashboard</a>
              </li>
              <li>
                <a routerLink="/upload" class="text-dark">Subir PDF</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.05);">
        © {{currentYear}} InvoiceSync
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: 3rem;
    }
    .text-uppercase {
      color: #3f51b5;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
