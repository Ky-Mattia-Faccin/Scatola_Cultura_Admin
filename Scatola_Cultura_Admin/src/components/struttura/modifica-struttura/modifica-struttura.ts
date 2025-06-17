import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Struttura } from '../../../interfaces/Istruttura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modifica-struttura',
  imports: [CommonModule,FormsModule],
  templateUrl: './modifica-struttura.html',
  styleUrl: './modifica-struttura.css'
})
export class ModificaStruttura implements OnInit{

  constructor(private rotta:ActivatedRoute){}

  strutture:Struttura[]=[]

  struttura!:Struttura


  ngOnInit(): void {

    const parametroId = this.rotta.snapshot.paramMap.get('id');
    let idStruttura:number | null=null

    if (parametroId != null) {
      idStruttura = parseInt(parametroId, 10);

      // Caricamento delle strutture dal localStorage
      const strutture: Struttura[] = JSON.parse(sessionStorage.getItem('strutture') || '[]');

      // Ricerca della struttura con l'ID specificato
      const trovata = strutture.find((s: Struttura) => s.idStruttura === idStruttura);

      if (trovata)
        this.struttura = trovata;
      else {
        console.error(`Struttura con id: ${idStruttura} non trovata`);
      }
    } else {
      console.error(`La struttura con id: ${idStruttura} non esiste`);
    }
  }

  onFileSelected(evento:Event){
    //invio a cloud
  }



}
