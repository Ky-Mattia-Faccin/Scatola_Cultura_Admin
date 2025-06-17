import { Component, OnInit } from '@angular/core';
import { Struttura } from '../../../../interfaces/Istruttura';
import { ServizoHttp } from '../../../../services/servizo-http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scelta-modifica-struttura',
  imports:[CommonModule,RouterLink],
  templateUrl: './scelta-modifica-struttura.html',
  styleUrls: ['./scelta-modifica-struttura.css']
})


export class SceltaModificaStruttura implements OnInit{
  
  strutture:Struttura[]=[]

  strutture$!:Observable<Struttura[]>;


  constructor(private servizioHttp:ServizoHttp){}

  ngOnInit(): void {
    this.strutture$=this.servizioHttp.getStrutture()
  }

}
