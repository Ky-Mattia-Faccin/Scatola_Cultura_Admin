import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Struttura } from '../interfaces/Istruttura';
import { HttpClientModule } from '@angular/common/http';
import { catDisabilita } from '../components/categoria/disabilita-categoria/disabilita-categoria';
@Injectable({
  providedIn: 'root',
})
export class ServizoHttp {
  constructor(private httpClient: HttpClient) {}

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

  sendData(dati: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.123.150:5000/api/Struttura/postConImmagine',
      dati
    );
  }
}
