import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Struttura } from '../interfaces/Istruttura';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServizoHttp {
  constructor(private httpClient: HttpClient) {}

  /*
   getStrutture(): Observable<Struttura[]> {
    return this.httpClient
      .get<Struttura[]>(
        'https://dev.api.scatolacultura.it/api/DisabilitaStruttura/get'
      )
      .pipe(
        catchError((error) => {
          console.error('Errore nel recupero delle strutture:', error);
          return of([]);
        })
      );
  }
  */

  getStrutture(): Observable<Struttura[]> {
    return of(struttureMock);
  }
}

export const struttureMock: Struttura[] = [
  {
    idStruttura: 1,
    nomeStruttura: 'Morgan',
    descrizione: 'Set of decorative ceramic planters for indoor plants.',
    indirizzoCompleto: 'Havenlaan, 2',
    citta: 'Amsterdam',
    provincia: 'NH',
    via: 'Havenlaan',
    ambito: 'Arte',
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
    DidascaliaImmagine: 'Ceramic planters displayed in a gallery.',
    TestoSemplificato: 'Decorative planters for indoor use.',
  },
  {
    idStruttura: 2,
    nomeStruttura: 'Florence',
    descrizione: 'Historic villa with event facilities.',
    indirizzoCompleto: 'Via della Repubblica, 10',
    citta: 'Firenze',
    provincia: 'FI',
    via: 'Via della Repubblica',
    ambito: 'Cultura',
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
    DidascaliaImmagine: 'Historic villa facade with gardens.',
    TestoSemplificato: 'Villa for cultural events.',
  },
  {
    idStruttura: 3,
    nomeStruttura: 'Aurora',
    descrizione: 'Modern cultural space for exhibitions.',
    indirizzoCompleto: 'Corso Milano, 100',
    citta: 'Milano',
    provincia: 'MI',
    via: 'Corso Milano',
    ambito: 'Esposizioni',
    disabilita: [
      {
        categoria: 'Eventi Speciali',
        descrizione: 'Prenotazioni chiuse per mostra temporanea.',
      },
    ],
    DidascaliaImmagine: 'Interior of modern exhibition space.',
    TestoSemplificato: 'Cultural exhibition center.',
  },
  {
    idStruttura: 4,
    nomeStruttura: 'Verdi Center',
    descrizione: 'Community center with multipurpose rooms.',
    indirizzoCompleto: 'Piazza Roma, 3',
    citta: 'Roma',
    provincia: 'RM',
    via: 'Piazza Roma',
    ambito: 'Comunità',
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
    DidascaliaImmagine: 'Community center building with people.',
    TestoSemplificato: 'Community activities and events.',
  },
  {
    idStruttura: 5,
    nomeStruttura: 'Casa della Musica',
    descrizione: 'Music rehearsal and performance venue.',
    indirizzoCompleto: 'Via Verdi, 44',
    citta: 'Parma',
    provincia: 'PR',
    via: 'Via Verdi',
    ambito: 'Musica',
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
    DidascaliaImmagine: 'Band rehearsing inside the venue.',
    TestoSemplificato: 'Venue for music rehearsals and concerts.',
  },
];
