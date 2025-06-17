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
  didascaliaImmagine:string;
  testoSemplificato:string;
  flgDisabilita:boolean;
  immagine:{
    nomeImmagine:string;
    byteImmagine:number;
  };
  disabilita:[
    {categoria:string, descrizione:string}
  ];
}
