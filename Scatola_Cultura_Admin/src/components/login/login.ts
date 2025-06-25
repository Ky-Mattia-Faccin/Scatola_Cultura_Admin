import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'], // Corretto da styleUrl a styleUrls
})
export class Login implements OnInit, OnDestroy {
  username!: string; // Username inserito dall'utente
  email!: string; // Email (per registrazione)
  password!: string; // Password inserita

  tipo: string | null = null; // Query param per distinguere login da registrazione

  constructor(
    public auth: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * OnInit: aggiunge una classe al body per lo stile della pagina login
   * e legge il parametro di query 'tipo' per determinare se mostrare login o registrazione
   */
  ngOnInit() {
    document.body.classList.add('login-page');

    this.route.queryParams.subscribe((params) => {
      this.tipo = params['tipo'] || null;
      console.log('Tipo query param:', this.tipo);
    });
  }

  /**
   * OnDestroy: rimuove la classe aggiunta al body per evitare effetti collaterali in altre pagine
   */
  ngOnDestroy() {
    document.body.classList.remove('login-page');
  }

  /**
   * Naviga alla stessa pagina impostando query param tipo=SignUp per mostrare il form di registrazione
   */
  ChangeSignUp() {
    this.router.navigate(['/login'], { queryParams: { tipo: 'SignUp' } });
  }

  /**
   * Naviga alla pagina login senza query param, per mostrare il form di login
   */
  ChangeSignIn() {
    this.router.navigate(['/login']);
  }

  /**
   * Metodo per effettuare il login usando il servizio Auth
   * Se il login ha successo, reindirizza alla home page '/'
   */
  signIn() {
    this.auth.login(this.username, this.password).subscribe((success) => {
      if (success) {
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Metodo per la registrazione.
   * Se la registrazione va a buon fine, esegue automaticamente il login e reindirizza alla home.
   */
  signUp() {
    this.auth
      .signUp(this.username, this.password, this.email)
      .subscribe((success) => {
        if (success) {
          this.auth
            .login(this.username, this.password)
            .subscribe((loginSuccess) => {
              if (loginSuccess) {
                this.router.navigate(['/']);
              } else {
                alert('Login dopo registrazione fallito');
              }
            });
        } else {
          alert('Registrazione fallita');
        }
      });
  }
}
