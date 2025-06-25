import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/**
 * Guard di autenticazione per proteggere le rotte.
 * Controlla se l'utente è loggato, altrimenti reindirizza al login.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);      // Inietta il servizio Auth
  const router = inject(Router);  // Inietta il Router per navigare

  if (auth.isLoggedIn()) {
    // Se l'utente è autenticato, permette l'accesso alla rotta
    return true;
  }

  // Se non è autenticato, reindirizza alla pagina di login
  router.navigate(['/login']);
  return false;
};
