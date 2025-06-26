// Import dei moduli necessari
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Struttura } from '../../../interfaces/Istruttura';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ServizioHttp } from '../../../services/servizio-http';
import { Subscription } from 'rxjs';

// Interfaccia per rappresentare i dati del form
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
  imports: [CommonModule, FormsModule], // Import dei moduli necessari per template
  templateUrl: './modifica-struttura.html',
  styleUrls: ['./modifica-struttura.css'], // Foglio di stile associato
})
export class ModificaStruttura implements OnInit, OnDestroy {
  // Dati iniziali del form
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

  struttura!: Struttura; // Oggetto struttura corrente
  private routeSub!: Subscription; // Per gestire la sottoscrizione alla route

  selectedFile: File | null = null; // File immagine selezionato
  previewUrl: string | null = null; // Preview dell'immagine

  constructor(
    private rotta: ActivatedRoute, // Servizio per accedere ai parametri dell'URL
    private servizioHttp: ServizioHttp, // Servizio HTTP per le chiamate al backend
    private cdr: ChangeDetectorRef // Permette il rilevamento manuale dei cambiamenti
  ) {}

  idStruttura: number = 0; // ID della struttura da modificare

  @ViewChild('strutturaForm') strutturaForm!: NgForm; // Accesso al form tramite template reference

  ngOnInit(): void {
    // Ottenimento dell'ID della struttura dai parametri dell'URL
    this.routeSub = this.rotta.paramMap.subscribe((params: ParamMap) => {
      const parametroId = params.get('id');
      if (parametroId !== null) {
        this.idStruttura = parseInt(parametroId, 10);
        this.loadStruttura(this.idStruttura); // Caricamento dei dati
      }
    });
  }

  datiFormOriginale: any; // Per il confronto con i dati originali

  loadStruttura(idStruttura: number) {
    // Carica la struttura dal sessionStorage
    const strutture: Struttura[] = JSON.parse(
      sessionStorage.getItem('strutture') || '[]'
    );
    const trovata = strutture.find((s) => s.idStruttura === idStruttura);

    if (trovata) {
      this.struttura = trovata;

      // Popola il form con i dati della struttura
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

      // Salva una copia originale per rilevare modifiche
      this.datiFormOriginale = { ...this.datiForm };
      this.previewUrl = this.struttura.immagine?.immagineUrl || null;
    } else {
      console.error(`Struttura con id: ${idStruttura} non trovata`);
    }
  }

  // Gestione selezione immagine
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Rimuove la preview precedente se esistente
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
      this.cdr.detectChanges(); // Forza l'aggiornamento del DOM
    }
  }

  // Restituisce l'anteprima da visualizzare
  getImagePreview(): string | null {
    return this.selectedFile
      ? URL.createObjectURL(this.selectedFile)
      : this.previewUrl;
  }

  // Funzione per l’invio dei dati
  submit() {
    // Se c’è una didascalia ma nessuna immagine, mostra un alert
    if (
      !this.selectedFile &&
      !this.previewUrl &&
      this.datiForm.didascaliaImmagine
    ) {
      alert('Hai inserito una didascalia ma nessuna immagine.');
      return;
    }

    // Se non è presente immagine nuova, la proprietà resta null
    if (!this.selectedFile && !this.previewUrl) this.selectedFile = null;

    // Crea il DTO da inviare
    const strutturaDTO = {
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
        NomeImmagine: this.selectedFile ? this.selectedFile.name : ' ',
        immagineUrl: '',
        DidascaliaImmagine: this.datiForm.didascaliaImmagine,
      },
    };

    // Costruzione del payload
    const formDataToSend = new FormData();
    this.selectedFile
      ? formDataToSend.append('file', this.selectedFile, this.selectedFile.name)
      : formDataToSend.append('file', '');

    formDataToSend.append('dto', JSON.stringify(strutturaDTO));

    this.sendData(formDataToSend);
  }

  // Pulizia alla distruzione del componente
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  // Invio al backend
  sendData(dataToSend: any) {
    
    for (const pair of dataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]); // Log dei dati inviati
    }
    this.servizioHttp.updateStruttura(dataToSend, this.idStruttura).subscribe({
      next: (res) => {
        alert('Struttura aggiornata con successo!');
      },
      error: (err) => {
        console.error('Errore upload', err);
        let errorMsg = 'Errore nel caricamento, riprova.';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error.message) {
            errorMsg = err.error.message;
          } else if (err.error.errors) {
            errorMsg = Object.values(err.error.errors).flat().join('\n');
          }
        }
        alert(`Errore nel caricamento: \n${errorMsg}`);
      },
    });
  }

  // Permette solo lettere e spazi (es. per nomi)
  allowOnlyLetters(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!/^[a-zA-Z\s]$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Permette lettere, numeri, spazi e alcuni simboli (per indirizzi)
  allowOnlyValidChars(event: KeyboardEvent) {
    const inputChar = event.key;
    const regex = /^[a-zA-Z0-9,\/\\\s]$/;
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Verifica se il form è stato modificato
  isFormModified(): boolean {
    const isDataChanged =
      JSON.stringify(this.datiForm) !== JSON.stringify(this.datiFormOriginale);
    const isImageChanged = !!this.selectedFile;
    return isDataChanged || isImageChanged;
  }
}
