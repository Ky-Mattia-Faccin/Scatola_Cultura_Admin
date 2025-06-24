import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({  
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  username!: string;
  email!: string;
  password!: string;

  tipo: string | null = null;

  constructor(
    public auth: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    document.body.classList.add('login-page');

    this.route.queryParams.subscribe((params) => {
      this.tipo = params['tipo'] || null;
      console.log('Tipo query param:', this.tipo);
    });
  }

  ngOnDestroy() {
    document.body.classList.remove('login-page');
  }

  ChangeSignUp() {
    this.router.navigate(['/login'], { queryParams: { tipo: 'SignUp' } }); // corretto SignUp
  }

  ChangeSignIn() {
    this.router.navigate(['/login']);
  }

  signIn() {
    this.auth.login(this.username, this.password).subscribe((success) => {
      if (success) {
        this.router.navigate(['/']);
      }
    });
  }

  signUp() {
    this.auth
      .signUp(this.username, this.password, this.email)
      .subscribe((success) => {
        if (success) {
          // Effettua login direttamente dopo la registrazione
          this.auth.login(this.username, this.password).subscribe((loginSuccess) => {
            if (loginSuccess) {
              this.router.navigate(['/']);
            }
          });
        }
      });
  }
}
