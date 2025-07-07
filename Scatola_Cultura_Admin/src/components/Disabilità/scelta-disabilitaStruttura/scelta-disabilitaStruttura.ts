import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ValueChangeEvent } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, shareReplay, Subscription, tap } from 'rxjs';
import { ServizioHttp } from '../../../services/servizio-http';
import { Disabilita, Struttura } from '../../../interfaces/Istruttura';

export interface DisabilitaBackend {
  idStruttura: number;
  descrizione: string;
  flgDisabilita: boolean;
  disabilitaStruttura: number;
  testoSemplificato: string;
  disabilita: {
    categoria: string;
    descrizione: string;
    flgDisabilita: boolean;
  };
  flgWarning: boolean;
}

@Component({
  selector: 'app-scelta-disabilita',
  imports: [CommonModule, FormsModule],
  templateUrl: './scelta-disabilitaStruttura.html',
  styleUrl: './scelta-disabilitaStruttura.css',
})
export class SceltaDisabilitaStruttura implements OnInit {
  // ID della struttura selezionata, ottenuto dai parametri della route
  idStruttura!: number;

  constructor(
    private route: ActivatedRoute,
    private servizioHttp: ServizioHttp,
    private router: Router,
     private cdRef: ChangeDetectorRef
  ) {}

  // Observable che conterrà la lista di disabilità ottenute da HTTP
  disabilita$!: Observable<Disabilita[]>;
  disabilita!: Disabilita[];

  azione!: string;

  // Oggetto per gestire la sottoscrizione alla route
  private routeSub!: Subscription;

  ngOnInit(): void {
    // Sottoscrizione ai parametri della route per ottenere l'ID della struttura
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const parametroId = params.get('id');
      if (parametroId !== null) {
        this.idStruttura = parseInt(parametroId, 10);
        this.loadDisabilita();
      }
    });

    this.route.queryParams.subscribe((parametri) => {
      this.azione = parametri['azione'];
    });
  }

  //chiamata per ottenere le disabilita della struttura dall'id

  loadDisabilita() {
    this.disabilita$ = this.servizioHttp
      .getDisabilitàStruttura(this.idStruttura)
      .pipe(
        //per convertire i dati nel tipo Disabilita
        map((dataFromBackend: DisabilitaBackend[]): Disabilita[] =>
          dataFromBackend.map(
            (item: DisabilitaBackend): Disabilita => ({
              idStruttura: item.idStruttura,
              categoria: {
                nome: item.disabilita.categoria,
                descrizione: item.disabilita.descrizione,
                flgDisabilita: item.disabilita.flgDisabilita,
              },
              descrizione: item.descrizione,
              testoSemplificato: item.testoSemplificato,
              flgDisabilita: item.flgDisabilita,
              disabilitaStruttura: item.disabilitaStruttura,
              flgWarning: item.flgWarning,
            })
          )
        ),
        tap((mappa: Disabilita[]) => (this.disabilita = mappa)),
        shareReplay(1)
      );
  }

  // Metodo chiamato quando si clicca su una disabilità:
  // naviga alla pagina per modificarla, passando la categoria nella route
  onClickDisabilita(dis: Disabilita) {
    sessionStorage.setItem('disabilitaSelezionata', JSON.stringify(dis));
    this.router.navigate(['/modificaDisabilità']);
  }

  onSelectDisabilita(dis: Disabilita) {
    const stato = !dis.flgDisabilita;

    this.servizioHttp
      .patchDisabilità(dis.disabilitaStruttura, stato)
      .subscribe({
        next: () => {
          // // forza il rilevamento dei cambiamenti
          dis.flgDisabilita = !dis.flgDisabilita;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error(
            `Errore ${stato ? 'disabilitando' : 'riabilitando'} disabilità`,
            err
          );
          dis.flgDisabilita = !stato; // rollback in caso di errore
        },
      });
  }

  disabilitaFiltered(disabilita: Disabilita[]): Disabilita[] {
    if (this.azione === 'disattiva') {
      return disabilita; // mostra tutte
    }
    return disabilita.filter((d) => !d.flgDisabilita); // mostra solo abilitati
  }

  onToggleCheckbox(dis: Disabilita) {
    this.onSelectDisabilita(dis);
  }
}
