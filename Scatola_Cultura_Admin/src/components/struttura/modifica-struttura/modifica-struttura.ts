import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Struttura } from '../../../interfaces/Istruttura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServizoHttp } from '../../../services/servizo-http';

@Component({
  selector: 'app-modifica-struttura',
  imports: [CommonModule,FormsModule],
  templateUrl: './modifica-struttura.html',
  styleUrl: './modifica-struttura.css'
})
export class ModificaStruttura implements OnInit{

  constructor(private rotta:ActivatedRoute, private servizioHttp:ServizoHttp){}

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

 onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.servizioHttp.sendImg(file).subscribe({
      next: (base64Image) => {
        console.log('Upload completato:', base64Image);
       
      },
      error: (err) => {
        console.error('Errore upload:', err);
      }
    });
  }
}



}
