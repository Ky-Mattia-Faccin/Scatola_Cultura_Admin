import { Component, OnInit } from '@angular/core';
import { NavBar } from '../nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { ServizioHttp } from '../../services/servizio-http';
import { ValueChangeEvent } from '@angular/forms';
import { Struttura } from '../../interfaces/Istruttura';
import { shareReplay } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, NavBar],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout implements OnInit {
  constructor(private auth: Auth,private httpService:ServizioHttp) {}

  ngOnInit(): void {

    if (!this.auth.validateSession()) {

      return;
    }else{
      let strutture:Struttura[]
      this.httpService.getStrutture().subscribe(value=>{
        strutture=value;
        sessionStorage.setItem('strutture',JSON.stringify(value));
        shareReplay(1);
      })
    }

  }
}
