import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { Struttura } from '../../../interfaces/Istruttura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modifica-struttura',
  imports: [CommonModule,FormsModule],
  templateUrl: './modifica-struttura.html',
  styleUrl: './modifica-struttura.css'
})
export class ModificaStruttura implements OnInit{
  struttura!: Struttura;
  private routeSub!: Subscription;

  constructor(private rotta: ActivatedRoute, private servizioHttp: ServizioHttp) {}




  //si sottoscrive ai cambiamenti dei parametri di rotta per aggiornare i dati ogni volta che cambia l'id nella URL
  ngOnInit(): void {
    this.routeSub = this.rotta.paramMap.subscribe((params: ParamMap) => {
      const parametroId = params.get('id');
      if (parametroId != null) {
        const idStruttura = parseInt(parametroId, 10);
        this.loadStruttura(idStruttura);
      }

    });
  }
  // Se trovata, assegna la struttura alla proprietà del componente; altrimenti mostra un errore in console.
  loadStruttura(idStruttura: number) {
    const strutture: Struttura[] = JSON.parse(sessionStorage.getItem('strutture') || '[]');
    const trovata = strutture.find(s => s.idStruttura === idStruttura);

    if (trovata) {
      this.struttura = trovata;
    } else {
      console.error(`Struttura con id: ${idStruttura} non trovata`);
    }
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
 
}


