import { Component, OnDestroy, OnInit } from '@angular/core';
import { SceltaModificaStruttura } from '../../struttura/modifica-struttura/scelta-modifica-struttura/scelta-modifica-struttura';

@Component({
  selector: 'app-crea-disabilita',
  imports: [SceltaModificaStruttura],
  templateUrl: './crea-disabilita.html',
  styleUrl: './crea-disabilita.css',
})
export class CreaDisabilita implements OnInit {
  idStruttura: number = 0;
  categoria: string = '';

  ngOnInit(): void {
    //prendere id struttura e la categoria dal session storage

    const id = sessionStorage.getItem('idStrutturaSelezionata');
    this.idStruttura = id ? parseInt(id, 10): 1;


    const cat=sessionStorage.getItem('categoriaSelezionata');
    this.categoria=cat ? cat : '';
  }
}
