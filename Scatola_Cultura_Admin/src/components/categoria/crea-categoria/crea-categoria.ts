import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';

@Component({
  selector: 'app-crea-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './crea-categoria.html',
  styleUrl: './crea-categoria.css',
})
export class CreaCategoria {
  // Dati del form per la nuova categoria
  formData = {
    IdCategoria: '',
    DescCategoria: '',
  };

  constructor(private servizio: ServizioHttp) {}

    // Invio dei dati al servizio HTTP  
  submit() {
    this.servizio.sendCategoria(this.formData).subscribe({
      next: () => window.alert('Categoria inviata con successo'),
      error: () => window.alert('Errore invio categoria'),
    });
  }
}
