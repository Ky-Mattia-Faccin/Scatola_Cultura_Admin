import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Disabilita } from '../../../interfaces/Istruttura';

@Component({
  selector: 'app-modifica-disabilita',
  imports: [CommonModule, FormsModule],
  templateUrl: './modifica-disabilita.html',
  styleUrl: './modifica-disabilita.css',
})
export class ModificaDisabilita implements OnInit {
  constructor(private route: ActivatedRoute) {}

  disabilita!: Disabilita;
  id !: number;
  categoria ?: string;
  descrizione?:string;

  // Oggetto per gestire la sottoscrizione alla route
  private routeSub!: Subscription;

  ngOnInit(): void {
    this.getParams()
    const arrayDisabilitaJSON=sessionStorage.getItem(`disabilita${this.id}`)
    const arrayDisabilità:Disabilita[]=JSON.parse(arrayDisabilitaJSON || '[]')

    this.disabilita=arrayDisabilità.find((d) => d.categoria.nome === this.categoria)!;
  }

  getParams() {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const parametroId = params.get('id');

      if (parametroId !== null) this.id = parseInt(parametroId, 10);

      const cat = params.get('categoria')?.toString();

      if (cat !== null) this.categoria = cat;
    });
  }

  submit(){

  }
}
