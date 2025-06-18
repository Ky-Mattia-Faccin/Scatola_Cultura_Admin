import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Struttura } from '../../../interfaces/Istruttura';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';
import { Subscription } from 'rxjs';

interface FormData {
  nomeStruttura: string;
  ambito: string;
  citta: string;
  provincia: string;
  via: string;
  descrizione: string;
  testiSemplici: string;
  IndirizzoCompleto: string;
  posizione: string;
  Instagram: string;
  Facebook: string;
  sitoWeb: string;
  didascaliaImmagine: string;
}

@Component({
  selector: 'app-modifica-struttura',
  imports: [CommonModule, FormsModule],
  templateUrl: './modifica-struttura.html',
  styleUrls: ['./modifica-struttura.css'],  // Nota: styleUrls (plural)
})
export class ModificaStruttura implements OnInit, OnDestroy {

  datiForm: FormData = {
    nomeStruttura: '',
    ambito: '',
    citta: '',
    provincia: '',
    via: '',
    descrizione: '',
    testiSemplici: '',
    IndirizzoCompleto: '',
    posizione: '',
    Instagram: '',
    Facebook: '',
    sitoWeb: '',
    didascaliaImmagine: '',
  };

  struttura!: Struttura;
  private routeSub!: Subscription;

  base64Image: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private rotta: ActivatedRoute,
    private servizioHttp: ServizioHttp,
    private cdr: ChangeDetectorRef
  ) {}

  idStruttura:number=0;
  ngOnInit(): void {
    this.routeSub = this.rotta.paramMap.subscribe((params: ParamMap) => {
      const parametroId = params.get('id');
      if (parametroId !== null) {
         this.idStruttura = parseInt(parametroId, 10);
        this.loadStruttura(this.idStruttura);
      }
    });
  }

  loadStruttura(idStruttura: number) {
    const strutture: Struttura[] = JSON.parse(sessionStorage.getItem('strutture') || '[]');
    const trovata = strutture.find(s => s.idStruttura === idStruttura);

    if (trovata) {
      this.struttura = trovata;

      // Carico i dati nella form
      this.datiForm = {
        nomeStruttura: this.struttura.nomeStruttura || '',
        ambito: this.struttura.ambito || '',
        citta: this.struttura.citta || '',
        provincia: this.struttura.provincia || '',
        via: this.struttura.via || '',
        descrizione: this.struttura.descrizione || '',
        testiSemplici: this.struttura.testoSemplificato || '',
        IndirizzoCompleto: this.struttura.indirizzoCompleto || '',
        posizione: this.struttura.posizione || '',
        Instagram: this.struttura.social1 || '',
        Facebook: this.struttura.social2 || '',
        sitoWeb: this.struttura.sitoWeb || '',
        didascaliaImmagine: this.struttura.immagine?.didascaliaImmagine || '',
      };

      
      this.base64Image = this.struttura.immagine?.byteImmagine.toString() || '';
    } else {
      console.error(`Struttura con id: ${idStruttura} non trovata`);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.convertToBase64(file)
        .then((base64) => {
          this.base64Image = base64.split(',')[1];
          this.selectedFile = file;
          this.cdr.detectChanges();
          console.log('base64Image settata:', this.base64Image?.slice(0, 30));
        })
        .catch((err) => {
          console.error('Errore conversione file:', err);
        });
    }
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  submit() {
    if (!this.base64Image) {
      console.error('Nessuna immagine selezionata');
      return;
    }

    const dataToSend = {
      NomeStruttura: this.datiForm.nomeStruttura,
      Ambito: this.datiForm.ambito,
      Citta: this.datiForm.citta,
      Provincia: this.datiForm.provincia,
      Via: this.datiForm.via,
      IndirizzoCompleto: this.datiForm.IndirizzoCompleto,
      Descrizione: this.datiForm.descrizione,
      TestoSemplificato: this.datiForm.testiSemplici,
      Posizione: this.datiForm.posizione,
      Social1: this.datiForm.Instagram,
      Social2: this.datiForm.Facebook,
      SitoWeb: this.datiForm.sitoWeb,
      DataInserimento: new Date().toISOString(),
      FlgDisabilita: false,
      Immagine: {
        ByteImmagine: this.base64Image,
        NomeImmagine: this.selectedFile?.name || 'errore',
        DidascaliaImmagine: this.datiForm.didascaliaImmagine,
      }
    };

    console.log(dataToSend);

    this.servizioHttp.updateStruttura(dataToSend,this.idStruttura).subscribe({
      next: (res) => {
        console.log('Upload riuscito', res);
        alert('Struttura modificata con successo!');
      },
      error: (err) => {
        console.error('Errore upload', err);
        if (err.error && err.error.errors) {
          console.error('Dettagli errori validazione:', err.error.errors);
        }
        alert('Errore nel caricamento, riprova.');
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
