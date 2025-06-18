import { Component, OnDestroy, OnInit } from '@angular/core';
import { SceltaModificaStruttura } from '../../struttura/modifica-struttura/scelta-struttura/scelta-struttura';
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
    //prendere id struttura e la categoria dal session storage

    const id = sessionStorage.getItem('idStrutturaSelezionata');
    this.idStruttura = id ? parseInt(id, 10): 1;


    const cat=sessionStorage.getItem('categoriaSelezionata');
    this.categoria=cat ? cat : '';
  }

  submit(){
    //invia al back end
  }

}
