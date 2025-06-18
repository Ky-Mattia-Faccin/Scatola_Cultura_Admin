import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Struttura } from '../../interfaces/Istruttura';
import { ServizioHttp } from '../../services/servizio-http';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})



export class NavBar {
  isCategoriaOpen: Boolean = false;
  isStrutturaOpen: boolean = false;
  isDisabilitaOpen: boolean = false;

  strutture!: Struttura[];

  constructor(private servizio: ServizioHttp, private router: Router) {}

  toggleStruttura() {
    this.isStrutturaOpen = !this.isStrutturaOpen;
  }

  toggleCategoria() {
    this.isCategoriaOpen = !this.isCategoriaOpen;
  }
  toggleDisabilita() {
    this.isDisabilitaOpen = !this.isDisabilitaOpen;
  }

  // Esegue la ricerca filtrando le strutture e naviga verso la pagina di modifica
  search() {
    const input = document.querySelector('.nb-search-input') as HTMLInputElement;
    const filtro = input.value;

    if (sessionStorage.getItem('strutture')) {
      const struttureJSON = sessionStorage.getItem('strutture');
      this.strutture = JSON.parse(struttureJSON || '[]');
      this.filterAndNavigate(filtro);
    } else {
      this.servizio.getStrutture().subscribe((value) => {
        this.strutture = value;
        this.filterAndNavigate(filtro);
      });
    }
  }

  /**
   * Filtra la lista delle strutture cercando quelle il cui nome contiene il filtro
   * e naviga alla pagina di modifica della struttura trovata.
   */
  private filterAndNavigate(filtro: string) {
    const struttura = this.strutture.find(s =>
      s.nomeStruttura.toLowerCase().includes(filtro.trim().toLowerCase())
    );

    if (struttura) {
      /* nella configurazione del RouterModule per far ricaricare la pagina 
      *  se si naviga verso la stessa route con parametri diversi.    
      */
      this.router.navigate(['/modificaStruttura', struttura.idStruttura]);
    }
  }
}
