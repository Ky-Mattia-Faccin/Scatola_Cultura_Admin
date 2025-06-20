import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    const body = { username, password };

    return this.httpClient.post('http://192.168.123.150:5000/api/authenticate/login', body).pipe(
      map(response => {
        sessionStorage.setItem('logged', 'true');
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
    return sessionStorage.getItem('logged') === 'true';
  }


}
