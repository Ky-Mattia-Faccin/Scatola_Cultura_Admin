import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { catDisabilita } from '../../../interfaces/Istruttura';


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

      this.servizioHttp.patchCategoria(cat.nome, disattiva).subscribe({
        next: () => {
          console.log(
            `Categoria ${cat.nome} ${
              disattiva ? 'disattivata' : 'riattivata'
            }`
          );
        },
        error: (err) => {
          console.error(
            `Errore ${
              disattiva ? 'disattivazione' : 'riattivazione'
            } categoria ${cat.nome}`,
            err
          );
          cat.flgDisabilita = !cat.flgDisabilita;
        },
      });
    } else if (this.azione === 'seleziona') {
      if (cat.flgDisabilita) {
        sessionStorage.setItem('categoriaSelezionata', cat.nome);
        console.log('Categoria selezionata:', cat.nome);
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
