import { Component, OnInit } from '@angular/core';
import { Struttura } from '../../../../interfaces/Istruttura';
import { ServizoHttp } from '../../../../services/servizo-http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-scelta-modifica-struttura',
  imports:[CommonModule,RouterLink],
  templateUrl: './scelta-modifica-struttura.html',
  styleUrls: ['./scelta-modifica-struttura.css']
})


export class SceltaModificaStruttura implements OnInit{
  
  strutture:Struttura[]=[]

  selectedId: number | null = null;

  constructor(private servizioHttp:ServizoHttp){}

  ngOnInit(): void {
    console.log('inizializzato');
    this.servizioHttp.getStrutture().subscribe(value=>{
      this.strutture=value
      
      const struttureJSON=JSON.stringify(this.strutture)
      sessionStorage.setItem('strutture',struttureJSON)


    })
  }

}
