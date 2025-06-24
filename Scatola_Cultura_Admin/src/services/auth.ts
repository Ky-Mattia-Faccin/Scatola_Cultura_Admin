import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  token: string = '';
  expirationDate!: Date;
  private checkSubscription?: Subscription;
  private promptShown = false;
  private userDeclined = false;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.loadSession();
  }

  private loadSession() {
    const loggedJSON = sessionStorage.getItem('logged');
    if (loggedJSON) {
      try {
        const logged = JSON.parse(loggedJSON);
        if (logged.token && logged.expiration) {
          this.token = logged.token;
          this.expirationDate = new Date(logged.expiration);

          if (new Date() >= this.expirationDate) {
            this.logOut();
          } else {
            this.startTokenCheck();
          }
        }
      } catch {
        sessionStorage.removeItem('logged');
      }
    }
  }

  login(username: string, password: string) {
    const body = { username, password };

    return this.httpClient
      .post('http://192.168.123.150:5000/api/authenticate/login', body)
      .pipe(
        map((response: any) => {
          const token = response.accessToken;
          const expiration = new Date(response.expiration);
          this.saveSession(token, expiration, username);
          this.startTokenCheck();
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

  private saveSession(token: string, expiration: Date, username: string) {
    this.token = token;
    this.expirationDate = expiration;
    const save = {
      username: username,
      stato: true,
      token: token,
      expiration: expiration,
    };
    sessionStorage.setItem('logged', JSON.stringify(save));
  }

  private clearSession() {
    sessionStorage.removeItem('logged');
    this.token = '';
    this.expirationDate = new Date();
  }

  signUp(username: string, password: string, email: string) {
    const body = { username, email, password };

    return this.httpClient
      .post('http://192.168.123.150:5000/api/authenticate/register-admin', body)
      .pipe(
        map(() => true),
        catchError((err) => {
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

  isLoggedIn(): boolean {
    const loggedJSON = sessionStorage.getItem('logged');
    if (!loggedJSON) return false;

    const logged = JSON.parse(loggedJSON);
    const now = new Date();
    const expiration = new Date(logged.expiration);

    return logged.stato === true && now < expiration;
  }

  validateSession(): boolean {
    const loggedJSON = sessionStorage.getItem('logged');
    if (!loggedJSON) return false;

    const logged = JSON.parse(loggedJSON);
    const now = new Date();
    const expiration = new Date(logged.expiration);

    if (logged.stato === true && now < expiration) {
      return true;
    } else {
      sessionStorage.removeItem('logged');
      this.logOut();
      return false;
    }
  }

  logOut() {
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
      this.checkSubscription = undefined;
    }
    sessionStorage.removeItem('logged');
    this.token = '';
    this.expirationDate = new Date();
    this.promptShown = false;
    this.userDeclined = false;
    this.router.navigate(['/login']);
  }

  private startTokenCheck() {
    if (this.checkSubscription) {
      this.checkSubscription.unsubscribe();
    }
    // Controlla ogni minuto la scadenza token
    this.checkSubscription = timer(0, 60 * 1000).subscribe(() => {
      this.handleTokenExpiration(this.expirationDate);
    });
  }

  private handleTokenExpiration(expiration: Date) {
    const now = new Date();
    const in5minutes = new Date(now.getTime() + 5 * 60 * 1000);

    if (in5minutes >= expiration && !this.promptShown && !this.userDeclined) {
      this.promptShown = true;

      const confirmRenew = window.confirm(
        'La tua sessione sta per scadere. Vuoi prolungarla?'
      );

      if (confirmRenew) {
        this.getRefreshToken().subscribe({
          next: (value: any) => {
            if (!value?.refreshToken) {
              alert('Errore nel rinnovo del token.');
              this.logOut();
              return;
            }

            const newExp = new Date(Date.now() + 60 * 60 * 1000); // 1 ora dopo
            this.token = value.refreshToken;
            this.expirationDate = newExp;
            this.promptShown = false;

            const loggedJSON = sessionStorage.getItem('logged');
            if (loggedJSON) {
              const logged = JSON.parse(loggedJSON);
              logged.token = value.refreshToken;
              logged.expiration = newExp;
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
        this.userDeclined = true;
      }
    } else if (now >= expiration) {
      this.logOut();
    }
  }

  getRefreshToken() {
    return this.httpClient.get(
      'http://192.168.123.150:5000/api/authenticate/refresh',
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  updatePw(dati: any) {
    return this.httpClient.put(`http://192.168.123.150:5000/api/`, dati);
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loggedJSON = sessionStorage.getItem('logged');
  const token = loggedJSON ? JSON.parse(loggedJSON).token : null;

  if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase()) && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
