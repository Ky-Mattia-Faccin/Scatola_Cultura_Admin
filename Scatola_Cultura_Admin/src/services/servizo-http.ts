import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
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

  sendModifiche(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);

    return this.httpClient
      .post<{ imageData: string }>(
        'http://192.168.123.150:5000/api/Immagine/post/',
        {formData}
      )
      .pipe(map((response) => `data:image/jpeg;base64,${response.imageData}`));
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
    social1: '',
    social2: '',
    posizione: '',
    sitoWeb: '',
    didascaliaImmagine: 'Ceramic planters displayed in a gallery.',
    testoSemplificato: 'Decorative planters for indoor use.',
    flgDisabilita: false,
    immagine: {
      nomeImmagine: '',
      byteImmagine: 7,
    },
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
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
    social1: '',
    social2: '',
    posizione: '',
    sitoWeb: '',
    didascaliaImmagine: 'Historic villa facade with gardens.',
    testoSemplificato: 'Villa for cultural events.',
    flgDisabilita: false,
    immagine: {
      nomeImmagine: '',
      byteImmagine: 6,
    },
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
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
    social1: '',
    social2: '',
    posizione: '',
    sitoWeb: '',
    didascaliaImmagine: 'Interior of modern exhibition space.',
    testoSemplificato: 'Cultural exhibition center.',
    flgDisabilita: false,
    immagine: {
      nomeImmagine: '',
      byteImmagine: 5,
    },
    disabilita: [
      {
        categoria: 'Eventi Speciali',
        descrizione: 'Prenotazioni chiuse per mostra temporanea.',
      },
    ],
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
    social1: '',
    social2: '',
    posizione: '',
    sitoWeb: '',
    didascaliaImmagine: 'Community center building with people.',
    testoSemplificato: 'Community activities and events.',
    flgDisabilita: false,
    immagine: {
      nomeImmagine: '',
      byteImmagine: 15,
    },
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
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
    social1: '',
    social2: '',
    posizione: '',
    sitoWeb: '',
    didascaliaImmagine: 'Band rehearsing inside the venue.',
    testoSemplificato: 'Venue for music rehearsals and concerts.',
    flgDisabilita: false,
    immagine: {
      nomeImmagine: '',
      byteImmagine: 12,
    },
    disabilita: [
      {
        categoria: 'Manutenzione',
        descrizione: 'Chiuso per lavori fino a maggio.',
      },
    ],
  },
];
