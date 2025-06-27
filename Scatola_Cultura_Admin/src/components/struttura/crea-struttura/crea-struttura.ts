import { ChangeDetectorRef, Component } from '@angular/core';
import { ServizioHttp } from '../../../services/servizio-http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Decoratore del componente Angular
@Component({
  selector: 'app-crea-struttura', // Nome usato per inserire questo componente in un template
  imports: [FormsModule, CommonModule], // Moduli importati per il template
  templateUrl: './crea-struttura.html', // Template HTML associato
  styleUrl: './crea-struttura.css', // File CSS associato
})
export class CreaStruttura {
  // Oggetto per raccogliere i dati inseriti nel form
  formData: any = {
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

  // File selezionato dall'utente (immagine)
  selectedFile: File | null = null;

  // Iniezione delle dipendenze: servizio HTTP personalizzato e ChangeDetector
  constructor(
    private servizoHttp: ServizioHttp,
    private cdr: ChangeDetectorRef
  ) {}

  // Metodo chiamato quando l'utente seleziona un file dal form
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // 1. Verifica che il file sia un'immagine supportata
    const allowedTypes = ['image/jpeg', 'image/png', 'image.gif'];
    if (!allowedTypes.includes(file.type)) {
      alert(
        'Tipo di file non supportato. Carica solo immagini JPG, PNG o GIF.'
      );
      return;
    }

    // 2. Verifica che il file non superi i 5MB
    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert('Il file è troppo grande. La dimensione massima è 5MB.');
      return;
    }

    // 3. Prova a leggere il file
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();

      img.onload = () => {
        this.selectedFile = file;
        this.cdr.detectChanges();
      };

      img.onerror = () => {
        alert("Il file sembra non essere un'immagine valida o è corrotto.");
        this.selectedFile = null;
      };

      img.src = dataUrl as string;
    };
    reader.onerror = () => {
      alert('Errore durante la lettura del file.');
      this.selectedFile = null;
    };

    reader.readAsDataURL(file);
  }

  // Restituisce un URL locale per la preview dell'immagine
  getImagePreview(): string | null {
    return this.selectedFile ? URL.createObjectURL(this.selectedFile) : null;
  }

  // Metodo per convertire un'immagine in base64
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

  // Metodo chiamato al submit del form
  submit() {
    // Se non c'è immagine ma è stata inserita una didascalia, mostra avviso
    if (!this.selectedFile && this.formData.didascaliaImmagine) {
      alert('Hai inserito una didascalia ma nessuna immagine.');
      return;
    }

    // Oggetto DTO che sarà inviato al backend
    const strutturaDTO = {
      nomeStruttura: this.formData.nomeStruttura,
      descrizione: this.formData.descrizione,
      indirizzoCompleto: this.formData.IndirizzoCompleto,
      citta: this.formData.citta,
      provincia: this.formData.provincia,
      via: this.formData.via,
      ambito: this.formData.ambito,
      social1: this.formData.Instagram,
      social2: this.formData.Facebook,
      posizione: this.formData.posizione,
      sitoWeb: this.formData.sitoWeb,
      flgDisabilita: false,
      testoSemplificato: this.formData.testiSemplici,
      immagine: {
        nomeImmagine: this.selectedFile?.name ?? '',
        immagineUrl: '', // Probabilmente verrà riempito dal backend
        didascaliaImmagine: this.formData.didascaliaImmagine,
      },
    };

    // Costruzione dell'oggetto FormData (file + JSON come stringa)
    const formDataToSend = new FormData();
    this.selectedFile
      ? formDataToSend.append('file', this.selectedFile, this.selectedFile.name)
      : formDataToSend.append('file', '');
    formDataToSend.append('dto', JSON.stringify(strutturaDTO));

    // Invio dei dati al backend
    this.sendData(formDataToSend);
  }

  // Metodo che si occupa dell'invio dei dati al backend tramite il servizio HTTP
  sendData(dataToSend: any) {
    this.servizoHttp.sendStruttura(dataToSend).subscribe({
      next: (res) => {
        alert('Struttura creata con successo!');
      },
      error: (err) => {
        console.error('Errore upload', err);

        let errorMsg = 'Errore nel caricamento, riprova.';

        // Gestione dei vari formati di errore dal backend
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
}
