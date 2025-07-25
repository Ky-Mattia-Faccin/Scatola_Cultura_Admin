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
    // byteImmagine:number;
    immagineUrl: '', 
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
  idStruttura:number,
  categoria:catDisabilita;
  descrizione:string,
  testoSemplificato:string,
  flgDisabilita:boolean;
  disabilitaStruttura:number
  flgWarning:boolean;
}
