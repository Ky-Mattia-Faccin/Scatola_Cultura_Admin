import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule,RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  isCategoriaOpen: Boolean = false;


  isStrutturaOpen: boolean = false;

  toggleStruttura() {
    this.isStrutturaOpen = !this.isStrutturaOpen;
  }


  toggleCategoria() {
    this.isCategoriaOpen = !this.isCategoriaOpen;
  }
}
