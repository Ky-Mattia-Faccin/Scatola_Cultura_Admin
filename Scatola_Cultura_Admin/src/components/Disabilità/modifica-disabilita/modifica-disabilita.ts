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

  disabilita !: Disabilita;
  id !: number;
  descrizione?:string;

  // Sottoscrizione per ascoltare i parametri della route
  private routeSub!: Subscription;

  ngOnInit(): void {
  const DisabilitaJSON = sessionStorage.getItem('disabilitaSelezionata');
  if (DisabilitaJSON) {
    this.disabilita = JSON.parse(DisabilitaJSON);
  } else {
    console.warn('Nessuna disabilità selezionata trovata in sessionStorage');
  }
  console.log(this.disabilita);
}


  submit(){
       // Metodo per inviare i dati modificati al backend (da implementare)
  }
}
