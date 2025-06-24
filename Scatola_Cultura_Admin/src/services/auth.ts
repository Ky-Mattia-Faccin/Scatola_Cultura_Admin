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
          this.expirationDate = new Date(response.expiration);
          const save = {
            username: username,
            stato: true,
            token: this.token,
            expiration: this.expirationDate,
          };
          sessionStorage.setItem('logged', JSON.stringify(save));
          return true;
        }),
        catchError((err) => {
          let message = 'Errore nel login';
          if (err.error?.message) {
            message = err.error.message;
          } else if (err.status === 401) {
            message = 'Credenziali non valide.';
          }

          alert(message);
          sessionStorage.removeItem('logged');
          return of(false);
        })
      );
  }

  logOut() {
    clearInterval(this.checkInterval);
    sessionStorage.removeItem('logged');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const loggedJSON = sessionStorage.getItem('logged');
    let bool = false;
    if (loggedJSON) {
      var logged = JSON.parse(loggedJSON);
      bool = Boolean(logged.token) && new Date(logged.expiration) > new Date();
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
          let message = 'Errore nella registrazione';

          if (err.error?.message) {
            message = err.error.message;
          } else if (err.status === 400) {
            message = 'Registrazione non valida. Verifica i dati inseriti.';
          }

          alert(message);
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

    let logged: any;
    try {
      logged = JSON.parse(raw);
      if (!logged.expiration) return;
    } catch {
      return;
    }

    const expIn = new Date(logged.expiration);
    this.expirationDate = expIn;

    this.checkInterval = setInterval(() => {
      this.handleTokenExpiration(this.expirationDate);
    }, 60 * 1000);
  }

  handleTokenExpiration(expiration: Date) {
    const now = new Date();
    const in5minutes = new Date(now.getTime() + 5 * 60 * 1000);

    if (in5minutes >= expiration && !this.promptShown && !this.userDeclined) {
      this.promptShown = true;
      const confirm = window.confirm(
        'La tua sessione sta per scadere. Vuoi prolungarla?'
      );
      if (confirm) {
        this.getRefreshToken().subscribe((value: any) => {
          const newExp = new Date(Date.now() + 60 * 60 * 1000); // nuova scadenza
          this.token = value.refreshToken;
          this.expirationDate = newExp;
          this.promptShown = false;

          const loggedJSON = sessionStorage.getItem('logged');
          if (loggedJSON) {
            const logged = JSON.parse(loggedJSON);
            logged.token = value.refreshToken;
            logged.expiration = newExp;
            sessionStorage.setItem('logged', JSON.stringify(logged));
          }
        });
      } else {
        this.userDeclined = true;
      }
    } else if (now >= expiration) {
      clearInterval(this.checkInterval);
      if (this.userDeclined) {
        this.logOut();
      }
    }
  }

  updatePw(vecchiaPw: string, nuovaPw: string) {}

  getRefreshToken() {
    return this.httpClient.get(
      'http://192.168.123.150:5000/api/authenticate/refresh'
    );
  }
}
