import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
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
  constructor(
    private route: ActivatedRoute,
    private servizioHttp: ServizioHttp,
    private router: Router
  ) {}

  disabilita!: Disabilita;
  id!: number;

  // Sottoscrizione per ascoltare i parametri della route
  private routeSub!: Subscription;

  ngOnInit(): void {
    const DisabilitaJSON = sessionStorage.getItem('disabilitaSelezionata');
    if (DisabilitaJSON) {
      this.disabilita = JSON.parse(DisabilitaJSON);
    } else {
      console.warn('Nessuna disabilità selezionata trovata in sessionStorage');
    }
  }

  submit() {
    const body = {
      descrizione: this.disabilita.descrizione,
      testoSemplificato: this.disabilita.testoSemplificato,
      flgWarning: this.disabilita.flgWarning,
    };
    // Chiama il servizio HTTP per aggiornare la disabilità, passando descrizione e ID
    this.servizioHttp
      .UpdateDisabilità(body, this.disabilita.disabilitaStruttura)
      .subscribe({
        next: (res) => {
          // Se la richiesta va a buon fine, mostra un messaggio di conferma all'utente
          alert('Struttura modificata con successo!');
        },
        error: (err) => {
          // Se c'è un errore, lo stampa sulla console per debug
          console.error('Errore upload', err);

          if (err.error && err.error.errors) {
            console.error('Dettagli errori validazione:', err.error.errors);
          }

          // Mostra un messaggio di errore all'utente invitandolo a riprovare
          alert('Errore nel caricamento, riprova.');
        },
      });
  }

  // Permette lettere, numeri, spazi e alcuni simboli (per indirizzi)
  allowOnlyValidChars(event: KeyboardEvent) {
    const inputChar = event.key;
    const regex = /^[a-zA-Z,\/\\\s]$/;
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }
}
