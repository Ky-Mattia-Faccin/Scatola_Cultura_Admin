import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Disabilita, Struttura } from '../interfaces/Istruttura';
import { HttpClientModule } from '@angular/common/http';
import { catDisabilita } from '../interfaces/Istruttura';
@Injectable({
  providedIn: 'root',
})
export class ServizioHttp {
  constructor(private httpClient: HttpClient) {}

  getStrutture(): Observable<Struttura[]> {
    return this.httpClient
      .get<Struttura[]>(
        //'https://dev.api.scatolacultura.it/api/DisabilitaStruttura/get'
        `http://192.168.123.150:5000/api/DisabilitaStruttura/get`
      )
      .pipe(
        catchError((error) => {
          console.error('Errore nel recupero delle strutture:', error);
          return of([]);
        })
      );
  }

  getCategorie(): Observable<catDisabilita[]> {
    return this.httpClient
      .get<catDisabilita[]>(
        'http://192.168.123.150:5000/api/Disabilita/getAllDisabilita'
      )
      .pipe(
        catchError((error) => {
          console.error('Errore nel recupero delle categorie:', error);
          return of([]);
        })
      );
  }

  patchCategoria(id: string, disattiva: boolean): Observable<any> {
    return this.httpClient.patch(
      `http://192.168.123.150:5000/api/Disabilita/patch?id=${id}`,
      {
        disattiva: true,
      }
    );
  }

  sendStruttura(dati: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.123.150:5000/api/Struttura/postConImmagine',
      dati
    );
  }

  updateStruttura(dati: any, id: number) {
    return this.httpClient.put(
      `http://192.168.123.150:5000/api/Struttura/updateStruttura/${id}`,
      dati
    );
  }

  patchStrutture(id: number, disattiva: boolean) {
    return this.httpClient.patch(
      `http://192.168.123.150:5000/api/Struttura/patch?id=${id}`,
      {
        disattiva: true,
      }
    );
  }

  sendCategoria(dati: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.123.150:5000/api/Disabilita/post',
      dati
    );
  }

  getDisabilitàStruttura(id: number): Observable<any[]> {
    return this.httpClient
      .get<any[]>(
        `http://192.168.123.150:5000/api/DisabilitaStruttura/getByID/${id}`
      )
      .pipe(
        catchError((error) => {
          console.error('Errore nel recupero delle disabilità:', error);
          return of([]);
        })
      );
  }

  patchDisabilità(id: number, disattiva: boolean): Observable<any> {
    return this.httpClient.patch(
      `http://192.168.123.150:5000/api/DisabilitaStruttura/patch?id=${id}`,
      {
        disattiva: true,
      }
    );
  }

  UpdateDisabilità(dati: string, id: number) {
    console.log(typeof dati, dati);
    return this.httpClient.put(
      `http://192.168.123.150:5000/api/DisabilitaStruttura/aggiornaDescrizione?id=${id}`,
        String(dati),
    );
  }
}
