import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-cambio-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './cambio-password.html',
  styleUrls: ['./cambio-password.css'],  // correggo da styleUrl a styleUrls
})
export class CambioPassword {
  // Campi per le password
  vecchiaPw: string = '';
  nuovaPw: string = '';
  confermaPw: string = '';

  // Oggetto per gestire la visibilità delle password (true = visibile)
  passwordVisible: { [key: string]: boolean } = {
    vecchiaPw: false,
    nuovaPw: false,
    conferma: false,
  };

  constructor(private auth: Auth) {}

  /**
   * Alterna la visibilità del campo password indicato.
   * @param fieldName Nome del campo ('vecchiaPw', 'nuovaPw', 'conferma')
   */
  togglePasswordVisibility(fieldName: string) {
    this.passwordVisible[fieldName] = !this.passwordVisible[fieldName];
  }

  /**
   * Metodo invocato al submit del form.
   * Recupera l'username dalla sessione e chiama il servizio Auth per aggiornare la password.
   */
  submit() {
    // Recupera i dati dell'utente loggato dalla sessionStorage
    const loggedJSON = sessionStorage.getItem('logged');
    if (!loggedJSON) {
      alert('Utente non loggato');
      return;
    }

    const account = JSON.parse(loggedJSON);
    const username = account.username;

    // Controllo base che nuova password e conferma coincidano
    if (this.nuovaPw !== this.confermaPw) {
      alert('La nuova password e la conferma non corrispondono');
      return;
    }

    const dati = {
      oldPassword: this.vecchiaPw,
      newPassword: this.nuovaPw, 
    };

    // Chiama il metodo del servizio Auth per aggiornare la password
    this.auth.updatePw(dati).subscribe()
  }
}
