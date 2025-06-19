import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Disabilita } from '../../../interfaces/Istruttura';
import { ServizioHttp } from '../../../services/servizio-http';

@Component({
  selector: 'app-modifica-disabilita',
  imports: [CommonModule, FormsModule],
  templateUrl: './modifica-disabilita.html',
  styleUrl: './modifica-disabilita.css',
})
export class ModificaDisabilita implements OnInit {
  constructor(private route: ActivatedRoute,private servizioHttp:ServizioHttp) {}

  disabilita !: Disabilita;
  id !: number;

  // Sottoscrizione per ascoltare i parametri della route
  private routeSub!: Subscription;

  ngOnInit(): void {
  const DisabilitaJSON = sessionStorage.getItem('disabilitaSelezionata');
  if (DisabilitaJSON) {
    this.disabilita = JSON.parse(DisabilitaJSON);
  } else {
    console.warn('Nessuna disabilità selezionata trovata in sessionStorage');
  }
  console.log(this.disabilita);
}


  submit(){
    this.servizioHttp.UpdateDisabilità(this.disabilita.descrizione,this.disabilita.disabilitaStruttura).subscribe({
      next: (res) => {
        alert('Struttura modificata con successo!');
      },
      error: (err) => {
        console.error('Errore upload', err);
        if (err.error && err.error.errors) {
          console.error('Dettagli errori validazione:', err.error.errors);
        }
        alert('Errore nel caricamento, riprova.');
      }
    });
  }
}
