import { Component, OnDestroy, OnInit } from '@angular/core';
import { SceltaStruttura } from '../../struttura/scelta-struttura/scelta-struttura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crea-disabilita',
  imports: [CommonModule,FormsModule],
  templateUrl: './crea-disabilita.html',
  styleUrl: './crea-disabilita.css',
})
export class CreaDisabilita implements OnInit {
  idStruttura: number = 0;
  categoria: string = '';
  descrizione:string='';

  ngOnInit(): void {
     // Recupera l'id della struttura selezionata da sessionStorage

    const id = sessionStorage.getItem('idStrutturaSelezionata');
    this.idStruttura = id ? parseInt(id, 10): 1;

     // Recupera la categoria selezionata da sessionStorage
    const cat=sessionStorage.getItem('categoriaSelezionata');
    this.categoria=cat ? cat : '';
  }

  submit(){
       // Invio dei dati al backend (da implementare)
  }

}
