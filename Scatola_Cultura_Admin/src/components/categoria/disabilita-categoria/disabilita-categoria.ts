import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServizoHttp } from '../../../services/servizo-http';
import { Observable } from 'rxjs';

export interface catDisabilita {
  categoria: string;
  descrizione: string;
  flgDisabilita: boolean;
}

@Component({
  selector: 'app-disabilita-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './disabilita-categoria.html',
  styleUrl: './disabilita-categoria.css',
})
export class DisabilitaCategoria implements OnInit {
  disabilita: catDisabilita[] = [];
  disabilitaDisattivate!: string[];

  constructor(private servizioHttp: ServizoHttp) {}

  onToggleCategoria(cat: catDisabilita) {
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
          `Errore ${disattiva ? 'disattivazione' : 'riattivazione'} categoria ${
            cat.categoria
          }`,
          err
        );

        cat.flgDisabilita = !cat.flgDisabilita;
      },
    });
  }

  disabilita$!: Observable<catDisabilita[]>;

  ngOnInit(): void {
    this.disabilita$ = this.servizioHttp.getCategorie();
  }
}
