import { Component, OnDestroy, OnInit } from '@angular/core';
import { SceltaStruttura } from '../../struttura/scelta-struttura/scelta-struttura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';

@Component({
  selector: 'app-crea-disabilita',
  imports: [CommonModule, FormsModule],
  templateUrl: './crea-disabilita.html',
  styleUrl: './crea-disabilita.css',
})
export class CreaDisabilita implements OnInit {

  
  idStruttura: number = 0;
  categoria: string = '';
  descrizione: string = '';
  testoSemplice:string='';
  flgWarning:boolean=false

  constructor(private servizio: ServizioHttp) {}

  ngOnInit(): void {
    // Recupera l'id della struttura selezionata da sessionStorage

    const id = sessionStorage.getItem('idStrutturaSelezionata');
    this.idStruttura = id ? parseInt(id, 10) : 1;

    // Recupera la categoria selezionata da sessionStorage
    const cat = sessionStorage.getItem('categoriaSelezionata');
    this.categoria = cat ? cat : '';
  }
submit() {
  // Crea l'oggetto body con i dati da inviare al server
  const body = {
    IdCategoria: this.categoria,  
    IdStruttura: this.idStruttura, 
    Descrizione: this.descrizione,
    TestoSemplice: this.testoSemplice,
    flgWarning:this.flgWarning
  };

  // Invia i dati al server tramite il servizio HTTP
  this.servizio.sendDisabilità(body).subscribe({

    next: () => window.alert('Categoria inviata con successo'),
    

    error: () => window.alert('Errore invio categoria'),
  });
}

}
