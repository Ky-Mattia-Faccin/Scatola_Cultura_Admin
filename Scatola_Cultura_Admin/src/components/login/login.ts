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
    });
  }

  /**
   * OnDestroy: rimuove la classe aggiunta al body per evitare effetti collaterali in altre pagine
   */
  ngOnDestroy() {
    document.body.classList.remove('login-page');
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

  
}
