import { Component, OnInit } from '@angular/core';
import { NavBar } from '../nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-layout',
  imports: [CommonModule,RouterOutlet,NavBar],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit{

  constructor(private auth:Auth){}

  ngOnInit(): void {
    if(this.auth.isLoggedIn())
      this.auth.checkToken();
  }

}
