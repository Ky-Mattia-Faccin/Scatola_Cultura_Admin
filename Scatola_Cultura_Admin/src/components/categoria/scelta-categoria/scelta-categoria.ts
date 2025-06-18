import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

export interface catDisabilita {
  categoria: string;
  descrizione: string;
  flgDisabilita: boolean;
}

@Component({
  selector: 'app-disabilita-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './scelta-categoria.html',
  styleUrl: './scelta-categoria.css',
})
export class SceltaCategoria implements OnInit {
  disabilitaDisattivate!: string[];
  azione: string = 'disabilita';

  constructor(
    private servizioHttp: ServizioHttp,
    private Activeroute: ActivatedRoute,
    private router: Router
  ) {}

  onToggleCategoria(cat: catDisabilita) {
    if (this.azione === 'disabilita') {
      const disattiva = cat.flgDisabilita;

      this.servizioHttp.patchCategoria(cat.categoria, disattiva).subscribe({
        next: () => {
          console.log(
            `Categoria ${cat.categoria} ${
              disattiva ? 'disattivata' : 'riattivata'
            }`
          );
        },
        error: (err) => {
          console.error(
            `Errore ${
              disattiva ? 'disattivazione' : 'riattivazione'
            } categoria ${cat.categoria}`,
            err
          );
          cat.flgDisabilita = !cat.flgDisabilita;
        },
      });
    } else if (this.azione === 'seleziona') {
      if (cat.flgDisabilita) {
        sessionStorage.setItem('categoriaSelezionata', cat.categoria);
        console.log('Categoria selezionata:', cat.categoria);
        this.router.navigate(['/creaDisabilità']);
      }else{
        
      }
    }
  }

  disabilita$!: Observable<catDisabilita[]>;

  ngOnInit(): void {
    this.disabilita$ = this.servizioHttp.getCategorie();

    this.Activeroute.queryParams.subscribe((parametri) => {
      this.azione = parametri['azione'];
    });
  }
}
