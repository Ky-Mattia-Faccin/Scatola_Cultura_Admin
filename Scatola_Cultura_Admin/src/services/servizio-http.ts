import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Disabilita, Struttura } from '../interfaces/Istruttura';
import { catDisabilita } from '../interfaces/Istruttura';

  // Base URL per comodità e manutenzione 
    export const baseUrl = 'https://dev.api.scatolacultura.it/api';

@Injectable({
  providedIn: 'root',
})
export class ServizioHttp {


  constructor(private httpClient: HttpClient) {}

  /**
   * Recupera tutte le strutture dal backend.
   * In caso di errore ritorna un array vuoto e stampa in console l'errore.
   */
  getStrutture(): Observable<Struttura[]> {
    return this.httpClient.get<Struttura[]>(`${baseUrl}/DisabilitaStruttura/get`)
      .pipe(
        catchError((error) => {
          console.error('Errore nel recupero delle strutture:', error);
          return of([]);
        })
      );
  }

  /**
   * Recupera tutte le categorie di disabilità.
   * Gestisce errori ritornando array vuoto e loggando in console.
   */
  getCategorie(): Observable<catDisabilita[]> {
    return this.httpClient.get<catDisabilita[]>(`${baseUrl}/Disabilita/getAllDisabilita`)
      .pipe(
        catchError((error) => {
          console.error('Errore nel recupero delle categorie:', error);
          return of([]);
        })
      );
  }

  /**
   * Patch per attivare/disattivare una categoria tramite ID.
   */
  patchCategoria(id: string, disattiva: boolean): Observable<any> {
    return this.httpClient.patch(`${baseUrl}/Disabilita/patch?id=${id}`,
      disattiva
    );
  }

  /**
   * POST per inviare una nuova struttura (con eventuale immagine).
   */
  sendStruttura(dati: any): Observable<any> {
    return this.httpClient.post(`${baseUrl}/Struttura/postConImmagine`, dati);
  }

  /**
   * PUT per aggiornare una struttura esistente dato l'id.
   */
  updateStruttura(dati: any, id: number) {
    return this.httpClient.put(`${baseUrl}/Struttura/updateConImmagine/${id}`, dati);
  }

  /**
   * PATCH per disattivare/attivare una struttura tramite id.
   */
  patchStrutture(id: number, disattiva: boolean) {
    return this.httpClient.patch(`${baseUrl}/Struttura/patch?id=${id}`, {
      disattiva: disattiva,
    });
  }

  /**
   * POST per creare una nuova categoria di disabilità.
   */
  sendCategoria(dati: any): Observable<any> {
    return this.httpClient.post(`${baseUrl}/Disabilita/post`, dati);
  }

  /**
   * GET per recuperare le disabilità associate a una struttura tramite id.
   * In caso di errore ritorna array vuoto.
   */
  getDisabilitàStruttura(id: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${baseUrl}/DisabilitaStruttura/getByID/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Errore nel recupero delle disabilità:', error);
          return of([]);
        })
      );
  }

  /**
   * PATCH per abilitare/disabilitare una disabilità specifica tramite id.
   */
  patchDisabilità(id: number, disattiva: boolean): Observable<any> {
    return this.httpClient.patch(`${baseUrl}/DisabilitaStruttura/patch?id=${id}`, {
      disattiva: disattiva,
    });
  }

  /**
   * PUT per aggiornare la descrizione di una disabilità tramite id.
   * body contiene i dati da aggiornare.
   */
  UpdateDisabilità(body: any, id: number) {
    return this.httpClient.put(`${baseUrl}/DisabilitaStruttura/aggiornaDescrizione?id=${id}`, body);
  }

  /**
   * POST per creare una nuova disabilità associata a una struttura.
   */
  sendDisabilità(dati: any) {
    return this.httpClient.post(`${baseUrl}/DisabilitaStruttura/post`, dati);
  }
}
