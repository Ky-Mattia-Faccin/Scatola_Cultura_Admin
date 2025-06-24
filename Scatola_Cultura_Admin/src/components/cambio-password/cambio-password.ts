import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

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


  constructor(private auth:Auth){}

  togglePasswordVisibility(fieldName: string) {
    this.passwordVisible[fieldName] = !this.passwordVisible[fieldName];
  }


  submit() {
    const loggedJSON=sessionStorage.getItem('logged')
    const account=JSON.parse(loggedJSON!)
    const username=account.username


    const dati={
      username:username,
      vecchiaPw:this.vecchiaPw,
      nuovaPw:this.confermaPw

    }
    this.auth.updatePw(dati)
  }
}
