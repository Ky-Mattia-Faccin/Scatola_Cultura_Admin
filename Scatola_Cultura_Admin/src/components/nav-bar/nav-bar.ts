import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Struttura } from '../../interfaces/Istruttura';
import { ServizioHttp } from '../../services/servizio-http';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})



export class NavBar {
  // Stati per gestire l'apertura/chiusura dei menu a tendina
  isCategoriaOpen: Boolean = false;
  isStrutturaOpen: boolean = false;
  isDisabilitaOpen: boolean = false;
  isAccountOpen:boolean=false

   // Array per memorizzare le strutture caricate
  strutture!: Struttura[];

  constructor(private servizio: ServizioHttp, private router: Router,private auth:Auth) {}

   // Toggle apertura/chiusura menu strutture
  toggleStruttura() {
    this.isStrutturaOpen = !this.isStrutturaOpen;
  }

    // Toggle apertura/chiusura menu categorie
  toggleCategoria() {
    this.isCategoriaOpen = !this.isCategoriaOpen;
  }
  // Toggle apertura/chiusura menu disabilità
  toggleDisabilita() {
    this.isDisabilitaOpen = !this.isDisabilitaOpen;
  }

  toggleAccount(){
   this.isAccountOpen=!this.isAccountOpen 
  }


  // Metodo per eseguire la ricerca filtrando le strutture per nome
  // e navigare alla pagina di modifica della struttura trovata
  search() {
    const input = document.querySelector('.nb-search-input') as HTMLInputElement;
    const filtro = input.value;

        // Se le strutture sono già in sessionStorage, usa quelle per il filtro
    if (sessionStorage.getItem('strutture')) {
      const struttureJSON = sessionStorage.getItem('strutture');
      this.strutture = JSON.parse(struttureJSON || '[]');
      this.filterAndNavigate(filtro);
    } else {
       // Altrimenti, le carica da backend e poi filtra
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
      // Naviga alla pagina di modifica struttura con id specifico
      this.router.navigate(['/modificaStruttura', struttura.idStruttura]);
    }
  }

  logOut(){
    this.auth.logOut()
  }


  
}
