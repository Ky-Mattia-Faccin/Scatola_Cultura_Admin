import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Struttura } from '../../../interfaces/Istruttura';
import { ServizioHttp } from '../../../services/servizio-http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scelta-modifica-struttura',
  imports: [CommonModule, RouterLink, FormsModule], 
  templateUrl: './scelta-struttura.html',
  styleUrls: ['./scelta-struttura.css'],
})
export class SceltaStruttura implements OnInit {
  azione: string = 'modifica'; // Variabile che definisce l’azione corrente (es. modifica, disabilita, seleziona)


  strutture$!: Observable<Struttura[]>; // Observable delle strutture, usato per il binding asincrono in template

  constructor(
    private servizioHttp: ServizioHttp, // Servizio per chiamate HTTP
    private router: Router, // Router per navigazione programmata
    private activeRoute: ActivatedRoute // Per leggere parametri e query params dalla rotta
  ) {}

  ngOnInit(): void {
    // Sottoscrizione ai query params per leggere il parametro "azione" dalla URL
    this.activeRoute.queryParams.subscribe(parametri => {
      this.azione = parametri['azione']; // Imposta l’azione in base al parametro query
      
      // Recupera le strutture dal backend (tramite servizio) e applica filtro in base all'azione
      this.strutture$ = this.servizioHttp.getStrutture().pipe(
        map(strutture => {
          if (this.azione === 'disabilita') {
            // Se l’azione è 'disabilita', mostra tutte le strutture, anche quelle disabilitate
            return strutture;
          }
          // Altrimenti filtra fuori le strutture disabilitate (flgDisabilita == true)
          return strutture.filter(s => !s.flgDisabilita);
        }),
        tap(strutture => sessionStorage.setItem('strutture', JSON.stringify(strutture))), // Salva in sessionStorage per uso futuro
        shareReplay(1) // Condivide il risultato con più subscribers evitando chiamate ripetute
      );
    });
  }

  // Metodo chiamato al click su una struttura nella lista
  onSelectStruttura(struttura: Struttura, id: number) {
    switch (this.azione) {
      case 'modifica':
        // Naviga alla pagina di modifica della struttura con l’id specificato
        this.router.navigate(['/modificaStruttura/', id]);
        break;

      case 'seleziona':
        // Memorizza l’id della struttura selezionata e naviga alla pagina disabilitaCategoria con azione seleziona
        sessionStorage.setItem('idStrutturaSelezionata', id.toString());
        this.router.navigate(['/disabilitaCategoria'], {
          queryParams: { azione: 'seleziona' },
        });
        break;

      case 'selezionaModifica':
        // Naviga alla modifica delle disabilità per la struttura selezionata
        this.router.navigate(['/modificaDisabilità/', id]);
        break;

      case 'disabilita':
        // Caso per disabilitare o riabilitare una struttura
        const stato = struttura.flgDisabilita;

        this.servizioHttp
          .patchStrutture(struttura.idStruttura, stato) // Invia richiesta PATCH con lo stato corrente (per cambiarlo)
          .subscribe({
            error: (err) => {
              // In caso di errore ripristina il valore originale
              console.error(`Errore ${stato ? 'disabilitando' : 'riabilitando'} struttura`, err);
              struttura.flgDisabilita = !struttura.flgDisabilita;
            },
          });
        break;

      case 'selezionaDisabilità':
        // Naviga alla pagina per scegliere la disabilità della struttura
        this.router.navigate(['/sceltaDisabilitàStruttura/', id]);
        break;

      case 'disattivaDisabilità': 
        // Naviga alla pagina scelta disabilità con query param azione 'disattiva'
        this.router.navigate(['/sceltaDisabilitàStruttura/', id], { queryParams: { azione: 'disattiva' } });
        break;

      default:
        // Azione non riconosciuta: log di avviso in console
        console.warn('Azione non riconosciuta:', this.azione);
        break;
    }
  }
}
