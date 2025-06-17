import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface catDisabilita {
  categoria: string;
  descrizione: string;
  checked: boolean;
}

@Component({
  selector: 'app-disabilita-categoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './disabilita-categoria.html',
  styleUrl: './disabilita-categoria.css',
})
export class DisabilitaCategoria  implements OnInit{
  
  disabilita!: catDisabilita[];

  disableCategories() {
    this.disabilita = this.disabilita.filter((cat) => !cat.checked);
  }


  ngOnInit(): void {
    this.disabilita=disabilitaMock
  }
}


export const disabilitaMock: catDisabilita[] = [
  {
    categoria: 'Manutenzione',
    descrizione: 'Chiuso per lavori fino a fine mese',
    checked: false
  },
  {
    categoria: 'Aggiornamento',
    descrizione: 'Aggiornamento software in corso',
    checked: false
  },
  {
    categoria: 'Pulizia',
    descrizione: 'Pulizie programmate settimanali',
    checked: false
  },
  {
    categoria: 'Eventi Speciali',
    descrizione: 'Prenotazioni bloccate per evento privato',
    checked: false
  },
  {
    categoria: 'Emergenza',
    descrizione: 'Inagibilità temporanea per emergenza',
    checked: false
  }
];
