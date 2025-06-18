import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Struttura } from '../../../../interfaces/Istruttura';
import { ServizioHttp } from '../../../../services/servizio-http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scelta-modifica-struttura',
  imports: [CommonModule, RouterLink],
  templateUrl: './scelta-modifica-struttura.html',
  styleUrls: ['./scelta-modifica-struttura.css'],
})
export class SceltaModificaStruttura implements OnInit {

  azione: string = 'modifica'; 

  strutture: Struttura[] = [];

  strutture$!: Observable<Struttura[]>;

  constructor(private servizioHttp: ServizioHttp,private router:Router,private activeRoute:ActivatedRoute) {}

  ngOnInit(): void {  
    this.activeRoute.queryParams.subscribe(parametri=>{
      this.azione=parametri['azione'];
    })


    this.strutture$ = this.servizioHttp.getStrutture();


    this.strutture$.subscribe((strutture) => {
      sessionStorage.setItem('strutture', JSON.stringify(strutture));
    });
  }

  onSelectStruttura(id:number){
    if(this.azione==='modifica')
      this.router.navigate(['/modificaStruttura/', id])
    else if(this.azione==='seleziona'){
      sessionStorage.setItem('idStrutturaSelezionata',id.toString())
      this.router.navigate(['/disabilitaCategoria'], { queryParams: { azione: 'seleziona' }})

    }

  }

  
}
