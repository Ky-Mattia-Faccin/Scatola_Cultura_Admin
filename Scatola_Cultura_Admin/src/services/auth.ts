import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private httpClient: HttpClient, private router: Router) {}

  token: string = '';
  expirationDate!: Date;

  login(username: string, password: string) {
    const body = { username, password };

    return this.httpClient
      .post('http://192.168.123.150:5000/api/authenticate/login', body)
      .pipe(
        map((response: any) => {
          this.token = response.token;
          this.expirationDate = response.expiration;
          const save = {
            stato: 'true',
            token: response.token,
            expiration: response.expirationDate,
          };
          sessionStorage.setItem('logged', JSON.stringify(save));
          return true;
        }),
        catchError((err) => {
          alert('Errore nel login');
          sessionStorage.removeItem('logged');
          return of(false);
        })
      );
  }

  logout() {
    sessionStorage.removeItem('logged');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const loggedJSON = sessionStorage.getItem('logged');
    let bool = false;
    if (loggedJSON) {
      var logged = JSON.parse(loggedJSON);
      bool = logged.stato;
    }
    return bool;
  }

  signUp(username: string, password: string, email: string) {
    const body = { username, email, password };

    return this.httpClient
      .post('http://192.168.123.150:5000/api/authenticate/register-admin', body)
      .pipe(
        // Se registrazione ok, effettua login
        map(() => true),
        catchError((err) => {
          alert('Errore nella registrazione');
          sessionStorage.removeItem('logged');
          return of(false);
        })
      );
  }
  private checkInterval: any;
  private promptShown = false;
  private userDeclined = false;

  checkToken() {
    const raw = sessionStorage.getItem('logged');
    if (!raw) return;

    const logged = JSON.parse(raw);
    const expIn = new Date(logged.expiration); // Data di scadenza del token

    this.checkInterval = setInterval(() => {
      this.handleTokenExpiration(expIn);
    }, 60 * 1000); // ogni minuto
  }

  handleTokenExpiration(expiration: Date) {
    const now = new Date();

    const in5minutes = new Date(now.getTime() + 5 * 60 * 1000);

    //propmt
    if (in5minutes >= expiration && !this.promptShown && !this.userDeclined) {
      this.promptShown = true;
      const confirm = window.confirm(
        'La tua sessione sta per scadere. Vuoi prolungarla?'
      );
      if (confirm) {
        //refresh token?
      }
    } else {
      // Se il token è scaduto ed è stato rifiutato il rinnovo
      if (now >= expiration) {
        clearInterval(this.checkInterval);
        if (this.userDeclined) {
          this.logout();
        }
      }
    }
  }
}
