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
  azione: string = 'disabilita';// Definisce l'azione corrente

  constructor(
    private servizioHttp: ServizioHttp,
    private Activeroute: ActivatedRoute,
    private router: Router
  ) {}

   // Gestisce il toggle della categoria: disabilita/riabilita o seleziona categoria
  onToggleCategoria(cat: catDisabilita) {
    if (this.azione === 'disabilita') {
      // Aggiorna lo stato di disabilitazione della categoria tramite PATCH
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
          cat.flgDisabilita = !cat.flgDisabilita; // Ripristina lo stato in caso di errore
        },
      });
    } else if (this.azione === 'seleziona') {
       // Seleziona la categoria e naviga alla pagina di creazione disabilità
      if (cat.flgDisabilita) {
        sessionStorage.setItem('categoriaSelezionata', cat.nome);
        console.log('Categoria selezionata:', cat.nome);
        this.router.navigate(['/creaDisabilità']);
      }
    }
  }

  disabilita$!: Observable<catDisabilita[]>;// Observable delle categorie disabilità

  ngOnInit(): void {
    // Ottiene le categorie dal servizio HTTP
    this.disabilita$ = this.servizioHttp.getCategorie();

    // Recupera l'azione da query params (disabilita o seleziona)
    this.Activeroute.queryParams.subscribe((parametri) => {
      this.azione = parametri['azione'];
    });
  }
}
