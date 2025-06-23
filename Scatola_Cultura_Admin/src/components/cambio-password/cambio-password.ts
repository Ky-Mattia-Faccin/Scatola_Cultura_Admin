import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cambio-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './cambio-password.html',
  styleUrl: './cambio-password.css',
})
export class CambioPassword {
  vecchiaPw: string = '';
  nuovaPw: string = '';
  confermaPw: string = '';

  passwordVisible: { [key: string]: boolean } = {
    vecchiaPw: false,
    nuovaPw: false,
    conferma: false,
  };

  togglePasswordVisibility(fieldName: string) {
    this.passwordVisible[fieldName] = !this.passwordVisible[fieldName];
  }


  submit() {}
}
