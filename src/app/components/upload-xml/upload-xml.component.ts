import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProcessResult } from '../../models/invoice.model';

@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.scss']
})
export class UploadXmlComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  fileName: string = '';
  loading = false;
  result: ProcessResult | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      sender: ['', [Validators.maxLength(100)]],
      date: ['', []]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      const isXml = file.name.toLowerCase().endsWith('.xml') || file.type === 'text/xml' || file.type === 'application/xml';
      if (!isXml) {
        this.error = 'Solo se permiten archivos XML';
        this.selectedFile = null;
        this.fileName = '';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.error = null;
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.error = 'Debe seleccionar un archivo XML';
      return;
    }

    this.loading = true;
    this.error = null;
    this.result = null;

    const formData = this.uploadForm.value;

    this.apiService.uploadXml(this.selectedFile, formData).subscribe({
      next: (result) => {
        this.result = result;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al procesar el archivo XML: ' + (err.error?.message || err.message || 'Error desconocido');
        this.loading = false;
        console.error(err);
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }

  resetForm(): void {
    this.uploadForm.reset();
    this.selectedFile = null;
    this.fileName = '';
    this.error = null;
    this.result = null;
  }
}

