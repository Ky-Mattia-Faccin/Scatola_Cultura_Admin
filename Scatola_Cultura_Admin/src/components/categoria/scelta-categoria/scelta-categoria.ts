import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';
import { map, Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catDisabilita } from '../../../interfaces/Istruttura';

@Component({
  selector: 'app-disabilita-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './scelta-categoria.html',
  styleUrl: './scelta-categoria.css',
})
export class SceltaCategoria implements OnInit {
  disabilitaDisattivate!: string[];
  azione: string = 'disabilita'; // Definisce l'azione corrente

  constructor(
    private servizioHttp: ServizioHttp,
    private Activeroute: ActivatedRoute,
    private router: Router,
    private cdRef:ChangeDetectorRef
  ) {}

  // Gestisce il toggle della categoria: disabilita/riabilita o seleziona categoria
  onToggleCategoria(cat: catDisabilita) {
    // Il nuovo stato da inviare al backend è il contrario dello stato attuale
    const nuovoStato = !cat.flgDisabilita;



    this.servizioHttp.patchCategoria(cat.nome, nuovoStato).subscribe({
      next: () => {
        cat.flgDisabilita = nuovoStato; // Aggiorna lo stato localmente dopo la risposta
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Errore aggiornando categoria', err);
        // Qui eventualmente gestisci rollback o messaggi di errore
      },
    });
  }

  onSelezionaCategoria(cat: catDisabilita) {
    // Naviga solo quando la modalità è "seleziona"
    sessionStorage.setItem('categoriaSelezionata', cat.nome);
    this.router.navigate(['/creaDisabilità']);
  }
  
  disabilita$!: Observable<catDisabilita[]>; // Observable delle categorie disabilità

  ngOnInit(): void {
    // Recupera l'azione da query params (disabilita o seleziona)
    this.Activeroute.queryParams.subscribe((parametri) => {
      this.azione = parametri['azione'];

      // Trasforma la risposta del backend in oggetti compatibili con catDisabilita
      this.disabilita$ = this.servizioHttp.getCategorie().pipe(
        map((response: any[]) =>
          response
            .map(
              (item) =>
                ({
                  nome: item.categoria,
                  descrizione: item.descrizione,
                  flgDisabilita: item.flgDisabilita,
                } as catDisabilita)
            )
            .filter((cat) => {
              // Se azione è 'disabilita', mostra tutto
              // Altrimenti escludi le categorie disabilitate
              return this.azione === 'disabilita' || !cat.flgDisabilita;
            })
        )
      );
    });
  }
  
}
