import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable, shareReplay, Subscription, tap } from 'rxjs';
import { ServizioHttp } from '../../../services/servizio-http';
import { Disabilita, Struttura } from '../../../interfaces/Istruttura';

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
    private router: Router
  ) {}

  // Observable che conterrà la lista di disabilità ottenute da HTTP
  disabilita$!: Observable<Disabilita[]>;

  // Array di disabilità per uso interno, utile per salvataggio in sessionStorage
  disabilita: Disabilita[] = [];

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
  }

  //chiamata per ottenere le disabilita della struttura dall'id
  loadDisabilita() {
    this.disabilita$ = this.servizioHttp
      .getDisabilitàStruttura(this.idStruttura)
      .pipe(
        tap((struttura) => {
          // Estrae le disabilità dalla struttura e le salva in una variabile locale
          this.disabilita = struttura.disabilita;
          // Salva le disabilità nel sessionStorage
          sessionStorage.setItem(
            `disabilita${this.idStruttura}`,
            JSON.stringify(this.disabilita)
          );
        }),
        map((struttura) => struttura.disabilita), // Estrae solo l'array di disabilità
        shareReplay(1)
      );
  }

  // Metodo chiamato quando si clicca su una disabilità:
  // naviga alla pagina per modificarla, passando la categoria nella route
  onClickDisabilita(dis: Disabilita) {
    console.log('idStruttura:', this.idStruttura);
    console.log('categoria:', dis.categoria.nome);

    this.router.navigate([
      '/modificaDisabilità',
      this.idStruttura,
      dis.categoria.nome.trim(),
    ]);
  }
}
