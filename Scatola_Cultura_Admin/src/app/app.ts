import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from "../components/nav-bar/nav-bar";
import { Auth } from '../services/auth';
import { Login } from "../components/login/login";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, Login,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App{
  protected title = 'CulturaSenzaBarriere_Admin';

  constructor(public auth: Auth) {}
}
