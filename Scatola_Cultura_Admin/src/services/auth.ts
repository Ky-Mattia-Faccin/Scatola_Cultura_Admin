import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, Subscription, throwError, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  token: string = ''; // Token di accesso JWT
  expirationDate!: Date; // Data di scadenza del token
  refreshToken: string = ''; // Token di refresh per ottenere nuovo token di accesso
  private checkSubscription?: Subscription; // Subscription per timer che controlla scadenza token
  private promptShown = false; // Flag per mostrare conferma rinnovo solo una volta
  private userDeclined = false; // Flag per evitare prompt multipli se utente rifiuta

  constructor(private httpClient: HttpClient, private router: Router) {
    this.loadSession(); // Carica eventuale sessione salvata all’avvio
  }

  // Carica dati di sessione salvati in sessionStorage
  private loadSession() {
    const loggedJSON = sessionStorage.getItem('logged');
    if (loggedJSON) {
      try {
        const logged = JSON.parse(loggedJSON);
        if (logged.token && logged.expiration) {
          this.token = logged.token;
          this.expirationDate = new Date(logged.expiration);
          this.refreshToken = logged.refreshToken;

          // Se token è scaduto, esegue logout
          if (new Date() >= this.expirationDate) {
            this.logOut();
          } else {
            // Altrimenti avvia controllo periodico token
            this.startTokenCheck();
          }
        }
      } catch {
        // Se JSON non valido, elimina la sessione salvata
        sessionStorage.removeItem('logged');
      }
    }
  }

  // Metodo per effettuare il login
  login(username: string, password: string) {
    const body = { username, password };

    return this.httpClient
      .post('http://192.168.123.150:5000/api/authenticate/login', body)
      .pipe(
        map((response: any) => {
          // Riceve token, refresh token e scadenza dal backend
          const token = response.accessToken;
          const refresh = response.refreshToken;

          // Converte la data di scadenza da UTC a locale
          const expirationUTC = new Date(response.expiration);
          const expiration = new Date(
            expirationUTC.getTime() + new Date().getTimezoneOffset() * -60000
          );

          // per test
          //  const expiration = new Date(Date.now() + 2 * 60 * 1000);

          // Salva i dati della sessione
          this.saveSession(token, expiration, username, refresh);

          // Avvia il timer di controllo token
          this.startTokenCheck();

          return true;
        }),
        catchError((err) => {
          // Gestione errori login, con messaggi personalizzati
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

  // Salva i dati della sessione in sessionStorage
  private saveSession(
    token: string,
    expiration: Date,
    username: string,
    refresh: string
  ) {
    this.token = token;
    this.expirationDate = expiration;
    const save = {
      username: username,
      stato: true,
      token: token,
      refreshToken: refresh,
      expiration: expiration,
    };
    sessionStorage.setItem('logged', JSON.stringify(save));
  }

  // Pulisce la sessione (logout locale)
  private clearSession() {
    sessionStorage.removeItem('logged');
    this.token = '';
    this.expirationDate = new Date();
  }

  // Metodo per registrare un nuovo utente/admin
  signUp(username: string, password: string, email: string) {
    const body = { username, email, password };

    return this.httpClient
      .post('http://192.168.123.150:5000/api/authenticate/register-admin', body)
      .pipe(
        map(() => true),
        catchError((err) => {
          // Gestione errori registrazione
          let message = 'Errore nella registrazione';
          if (err.error?.message) {
            message = err.error.message;
          } else if (err.status === 400) {
            message = 'Registrazione non valida. Verifica i dati inseriti.';
          }

          alert(message);
          return of(false);
        })
      );
  }

  // Controlla se l’utente è loggato e il token non è scaduto
  isLoggedIn(): boolean {
    const loggedJSON = sessionStorage.getItem('logged');
    if (!loggedJSON) return false;

    const logged = JSON.parse(loggedJSON);
    const now = new Date();
    const expiration = new Date(logged.expiration);

    return logged.stato === true && now < expiration;
  }

  // Valida la sessione corrente, effettua logout se scaduta
  validateSession(): boolean {
    const loggedJSON = sessionStorage.getItem('logged');
    if (!loggedJSON) return false;

    const logged = JSON.parse(loggedJSON);
    const now = new Date();
    const expiration = new Date(logged.expiration);

    if (logged.stato === true && now < expiration) {
      return true;
    } else {
      this.clearSession();
      this.logOut();
      return false;
    }
  }

  // Esegue logout: annulla timer, pulisce sessione e reindirizza al login
  logOut() {
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
      this.checkSubscription = undefined;
    }
    this.clearSession();
    this.promptShown = false;
    this.userDeclined = false;
    this.router.navigate(['/login']);
  }

  // Avvia timer che ogni minuto controlla scadenza token
  private startTokenCheck() {
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
    }
    this.checkSubscription = timer(0, 60 * 1000).subscribe(() => {
      this.handleTokenExpiration(this.expirationDate);
    });
  }

  // Gestisce la scadenza del token: mostra prompt per rinnovo o fa logout
  private handleTokenExpiration(expiration: Date) {
    const now = new Date();
    const in5minutes = new Date(now.getTime() + 5 * 60 * 1000);

    // Se mancano meno di 5 minuti e non è stato già mostrato il prompt
    if (in5minutes >= expiration && !this.promptShown && !this.userDeclined) {
      this.promptShown = true;

      const confirmRenew = window.confirm(
        'La tua sessione sta per scadere. Vuoi prolungarla?'
      );

      if (confirmRenew) {
        // Se confermato, invia richiesta di refresh token
        const data = {
          accessToken: this.token,
          refreshToken: this.refreshToken,
        };
        this.getRefreshToken(data).subscribe({
          next: (value: any) => {
            if (!value?.refreshToken) {
              alert('Errore nel rinnovo del token.');
              this.logOut();
              return;
            }

            // Aggiorna token e scadenza 
            const newExpUTC = new Date(Date.now());
            const newExpCET = new Date(
              newExpUTC.getTime() + new Date().getTimezoneOffset() * -60000
            );

            this.token = value.refreshToken;
            this.expirationDate = new Date(
              newExpCET.getTime() + 60 * 60 * 1000
            );
            this.promptShown = false;

            // Aggiorna dati sessione in sessionStorage
            const loggedJSON = sessionStorage.getItem('logged');
            if (loggedJSON) {
              const logged = JSON.parse(loggedJSON);
              logged.token = value.refreshToken;
              logged.expiration = this.expirationDate;
              logged.stato = true;
              sessionStorage.setItem('logged', JSON.stringify(logged));
            }
          },
          error: () => {
            alert('Sessione scaduta. Effettua nuovamente il login.');
            this.logOut();
          },
        });
      } else {
        // L’utente ha rifiutato il rinnovo, non mostrare più prompt
        this.userDeclined = true;
      }
    } else if (now >= expiration) {
      // Token scaduto: logout automatico
      this.logOut();
    }
  }

  // Richiede il rinnovo del token al backend
  getRefreshToken(data: any) {
    return this.httpClient.post(
      'http://192.168.123.150:5000/api/authenticate/refresh',
      data
    );
  }

  // Aggiorna password utente
  updatePw(dati: any) {
    return this.httpClient
      .post(
        `http://192.168.123.150:5000/api/authenticate/changePassword`,
        dati,
        { responseType: 'text' }
      )
      .pipe(
        catchError((err) => {
          let message = 'Errore nel cambio di password';
          if (err.error?.message) {
            message = err.error.message;
          } else if (err.status === 400) {
            message = 'Credenziali non valide.';
          }

          alert(message);
          sessionStorage.removeItem('logged');
          return throwError(() => new Error(message));
        })
      );
  }
}






// Interceptor HTTP per aggiungere token di autorizzazione alle richieste

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loggedJSON = sessionStorage.getItem('logged');
  const token = loggedJSON ? JSON.parse(loggedJSON).token : null;

  const refreshToken = loggedJSON ? JSON.parse(loggedJSON).refreshToken : null;

  // URL endpoint refresh token da escludere
  const refreshUrl = 'http://192.168.123.150:5000/api/authenticate/refresh';

  // Se la richiesta è al refresh token, inserisce, il refresh token
  if (req.url === refreshUrl) {
    // const authReq = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${refreshToken}`,
    //   },})
    // return next(authReq);
    return next(req)
  }



  // Se c'è token, lo aggiunginge a alle richieste (GET, POST, PUT, PATCH, DELETE ecc.)
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  // Altrimenti continua la richiesta senza modifiche
  return next(req);
};
