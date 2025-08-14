import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { EmailConfig, EmailTestResult } from '../../models/invoice.model';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss']
})
export class EmailConfigComponent implements OnInit {
  emailConfigs: EmailConfig[] = [];
  newConfig: EmailConfig = this.createEmptyConfig();
  showAddForm = false;
  testResults: { [index: number]: EmailTestResult } = {};
  testing: { [index: number]: boolean } = {};
  
  // Configuraciones predefinidas para proveedores comunes
  providers = [
    {
      name: 'Gmail',
      host: 'imap.gmail.com',
      port: 993,
      use_ssl: true
    },
    {
      name: 'Outlook/Hotmail',
      host: 'imap-mail.outlook.com', 
      port: 993,
      use_ssl: true
    },
    {
      name: 'Yahoo',
      host: 'imap.mail.yahoo.com',
      port: 993,
      use_ssl: true
    },
    {
      name: 'Personalizado',
      host: '',
      port: 993,
      use_ssl: true
    }
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // En una implementación real, aquí cargaríamos las configuraciones existentes
    // Por ahora, inicializamos vacío
  }

  createEmptyConfig(): EmailConfig {
    return {
      host: '',
      port: 993,
      username: '',
      password: '',
      use_ssl: true,
      search_terms: ['factura', 'invoice', 'comprobante']
    };
  }

  selectProvider(provider: any): void {
    this.newConfig.host = provider.host;
    this.newConfig.port = provider.port;
    this.newConfig.use_ssl = provider.use_ssl;
  }

  addSearchTerm(): void {
    this.newConfig.search_terms.push('');
  }

  removeSearchTerm(index: number): void {
    this.newConfig.search_terms.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  testConfiguration(config: EmailConfig, index?: number): void {
    const testIndex = index !== undefined ? index : -1;
    this.testing[testIndex] = true;
    
    this.apiService.testEmailConfig(config).subscribe({
      next: (result: EmailTestResult) => {
        this.testResults[testIndex] = result;
        this.testing[testIndex] = false;
      },
      error: (err) => {
        this.testResults[testIndex] = {
          success: false,
          message: 'Error al conectar con el servidor',
          connection_test: false,
          login_test: false
        };
        this.testing[testIndex] = false;
        console.error(err);
      }
    });
  }

  addEmailConfig(): void {
    // Validación básica
    if (!this.newConfig.host || !this.newConfig.username || !this.newConfig.password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Filtrar términos de búsqueda vacíos
    this.newConfig.search_terms = this.newConfig.search_terms.filter(term => term.trim() !== '');
    
    // Agregar a la lista (en una implementación real, esto se enviaría al backend)
    this.emailConfigs.push({ ...this.newConfig });
    
    // Resetear formulario
    this.newConfig = this.createEmptyConfig();
    this.showAddForm = false;
    
    // Mostrar mensaje de éxito
    alert('Configuración de correo agregada exitosamente');
  }

  removeConfig(index: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta configuración?')) {
      this.emailConfigs.splice(index, 1);
      delete this.testResults[index];
      delete this.testing[index];
    }
  }

  cancelAdd(): void {
    this.newConfig = this.createEmptyConfig();
    this.showAddForm = false;
  }
}
