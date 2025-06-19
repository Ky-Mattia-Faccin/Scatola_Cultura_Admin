import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Struttura } from '../../../interfaces/Istruttura';
import { ServizioHttp } from '../../../services/servizio-http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scelta-modifica-struttura',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './scelta-struttura.html',
  styleUrls: ['./scelta-struttura.css'],
})
export class SceltaStruttura implements OnInit {
  azione: string = 'modifica';

  strutture: Struttura[] = [];

  strutture$!: Observable<Struttura[]>;

  constructor(
    private servizioHttp: ServizioHttp,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(parametri => {
    this.azione = parametri['azione'];
  });

  this.strutture$ = this.servizioHttp.getStrutture().pipe(
    tap(strutture => sessionStorage.setItem('strutture', JSON.stringify(strutture))),
    shareReplay(1)  // evita ulteriori chiamate multiple all'Observable
  );
  }

  onSelectStruttura(struttura: Struttura, id: number) {
    switch (this.azione) {
      case 'modifica':
        this.router.navigate(['/modificaStruttura/', id]);
        break;

      case 'seleziona':
        sessionStorage.setItem('idStrutturaSelezionata', id.toString());
        this.router.navigate(['/disabilitaCategoria'], {
          queryParams: { azione: 'seleziona' },
        });
        break;

      case 'selezionaModifica':
        this.router.navigate(['/modificaDisabilità/', id]);
        break;

      case 'disabilita':
        const stato = struttura.flgDisabilita;

        this.servizioHttp
          .patchStrutture(struttura.idStruttura, stato)
          .subscribe({
            next: () => {
              console.log(
                `Struttura ${struttura.nomeStruttura} ${
                  stato ? 'disabilitata' : 'riabilitata'
                }`
              );
            },
            error: (err) => {
              console.error(
                `Errore ${stato ? 'disabilitando' : 'riabilitando'} struttura`,
                err
              );
              struttura.flgDisabilita = !struttura.flgDisabilita;
            },
          });
        break;
      case 'selezionaDisabilità':
        this.router.navigate(['/sceltaDisabilitàStruttura/', id])
      break;
        case 'disattivaDisabilità': 
        this.router.navigate(['/sceltaDisabilitàStruttura/', id],{ queryParams:{azione:'disattiva'}}) 
          break
      default:
        console.warn('Azione non riconosciuta:', this.azione);
        break;
    }
  }
}
