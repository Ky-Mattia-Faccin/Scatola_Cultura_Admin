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
  styleUrls: ['./modifica-struttura.css'], // Nota: styleUrls (plural)
})export class ModificaStruttura implements OnInit, OnDestroy {
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

  // --- Mantengo base64 ma commentato ---
  // base64Image: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private rotta: ActivatedRoute,
    private servizioHttp: ServizioHttp,
    private cdr: ChangeDetectorRef
  ) {}

  idStruttura: number = 0;

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
    const strutture: Struttura[] = JSON.parse(
      sessionStorage.getItem('strutture') || '[]'
    );
    const trovata = strutture.find((s) => s.idStruttura === idStruttura);

    if (trovata) {
      this.struttura = trovata;

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

      // this.base64Image = this.struttura.immagine?.byteImmagine.toString() || '';

      this.previewUrl = this.struttura.immagine?.immagineUrl || null;
    } else {
      console.error(`Struttura con id: ${idStruttura} non trovata`);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // --- gestione base64 commentata ---
      /*
      this.convertToBase64(file)
        .then((base64) => {
          this.base64Image = base64.split(',')[1];
          this.selectedFile = file;
          this.cdr.detectChanges();
        })
        .catch((err) => {
          console.error('Errore conversione file:', err);
        });
      */

      // Gestione file diretta (senza base64)
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
      this.cdr.detectChanges();
    }
  }

  getImagePreview(): string | null {
  return this.selectedFile
    ? URL.createObjectURL(this.selectedFile)
    : this.previewUrl;
}

  // Funzione base64 commentata
  /*
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  */

  submit() {
    // Se vuoi puoi riattivare il controllo base64 (commentato)
    /*
    if (!this.base64Image) {
      console.error('Nessuna immagine selezionata');
      return;
    }
    */
    if (!this.selectedFile && !this.previewUrl) {
      alert("Seleziona un'immagine!");
      return;
    }

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
        // ByteImmagine: this.base64Image, // commentato
        NomeImmagine: this.selectedFile ? this.selectedFile.name : 'esistente',
         immagineUrl: '', 
        DidascaliaImmagine: this.datiForm.didascaliaImmagine,
      },
    };

    const formDataToSend = new FormData();
    formDataToSend.append('dto', JSON.stringify(strutturaDTO));
    if (this.selectedFile) {
      formDataToSend.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.sendData(formDataToSend);
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  sendData(dataToSend: any) {
    this.servizioHttp.sendStruttura(dataToSend).subscribe({
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
}