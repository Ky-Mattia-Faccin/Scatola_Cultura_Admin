export interface Struttura {
  idStruttura: number;
  nomeStruttura: string;
  descrizione: string;
  indirizzoCompleto: string;
  citta: string;
  provincia: string;
  via: string;
  ambito: string;
  social1:string;
  social2:string;
  posizione:string;
  sitoWeb:string;
  testoSemplificato:string;
  flgDisabilita:boolean;
  immagine:{
    nomeImmagine:string;
    byteImmagine:number;
    didascaliaImmagine:string;
  };
  disabilita:Disabilita[]
}


export interface catDisabilita {
  nome: string;
  descrizione: string;
  flgDisabilita: boolean;
}


export interface Disabilita{
  categoria:catDisabilita;
  descrizione:string,
  flgDisabilita:boolean;
}

/*
disabilita:[
  {
  categoria:{
    nome:'visiva',
    descrizione:'desc',
    flgDisabilita:false
  },
  descrizione:'descrizione',
  flgDisabilita:false
}
]*/