import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

interface Disabilita{
  categoria:string;
  descrizione:string;
}


@Component({
  selector: 'app-scelta-disabilita',
  imports: [CommonModule,FormsModule],
  templateUrl: './scelta-disabilita.html',
  styleUrl: './scelta-disabilita.css',
})
export class SceltaDisabilita implements OnInit {
  idStruttura!: number;

  constructor(private route: ActivatedRoute) {}

  disabilita$!:Subscription


  private routeSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const parametroId = params.get('id');
      if (parametroId !== null) {
        this.idStruttura = parseInt(parametroId, 10);
      }
    });

    //chiamata per ottenere le disabilita della struttura dall'id
  }



  onClickDisabilita(dis:Disabilita){
    //router.navigate alla pagina modifica di quella disabilità
  }
}
