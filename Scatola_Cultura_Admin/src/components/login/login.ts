import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
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

  singUp() {
    this.router.navigate(['/login'], { queryParams: { tipo: 'SingUp' } });
  }

  singIn() {
    this.router.navigate(['/login']);
  }
}
