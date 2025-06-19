import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Disabilita } from '../../../interfaces/Istruttura';

@Component({
  selector: 'app-modifica-disabilita',
  imports: [CommonModule, FormsModule],
  templateUrl: './modifica-disabilita.html',
  styleUrl: './modifica-disabilita.css',
})
export class ModificaDisabilita implements OnInit {
  constructor(private route: ActivatedRoute) {}

  disabilita!: Disabilita;
  id !: number;
  categoria ?: string;
  descrizione?:string;

  // Sottoscrizione per ascoltare i parametri della route
  private routeSub!: Subscription;

  ngOnInit(): void {
  // Recupera il parametro 'categoria' dalla route
    this.getCat()

  // Recupera dall’archivio sessionStorage l’array di disabilità selezionate
    const arrayDisabilitaJSON=sessionStorage.getItem(`disabilitàStrutturaSelezionata`)
    const arrayDisabilità:Disabilita[]=JSON.parse(arrayDisabilitaJSON || '[]')

    // Trova la disabilità corrispondente alla categoria recuperata dalla route
    this.disabilita=arrayDisabilità.find((d) => d.categoria.nome === this.categoria)!;
  }

  getCat() {
        // Sottoscrizione per aggiornare la categoria in base al parametro della route
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const cat = params.get('categoria')?.toString();

      if (cat !== null) this.categoria = cat;
    });
  }

  submit(){
       // Metodo per inviare i dati modificati al backend (da implementare)
  }
}
