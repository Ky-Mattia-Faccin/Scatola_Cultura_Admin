import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ServizioHttp } from '../../../services/servizio-http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-crea-struttura',
  imports: [FormsModule, CommonModule],
  templateUrl: './crea-struttura.html',
  styleUrl: './crea-struttura.css',
})
export class CreaStruttura {
  formData: any = {
    // Oggetto contenente i dati del form per la nuova struttura
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

  // Variabili per la gestione dell'immagine
  // base64Image: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private servizoHttp: ServizioHttp,
    private cdr: ChangeDetectorRef
  ) {}

  // Metodo chiamato al caricamento di un file: converte l'immagine in base64
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // this.convertToBase64(file)
      //   .then((base64) => {
      //     this.base64Image = base64.split(',')[1];
      this.selectedFile = file;
      this.cdr.detectChanges(); // Forza il rilevamento dei cambiamenti
      // })
      // .catch((err) => {
      //   console.error('Errore conversione file:', err);
      // });
    }
  }

  getImagePreview(): string | null {
    return this.selectedFile ? URL.createObjectURL(this.selectedFile) : null;
  }

  // Metodo per convertire un file immagine in una stringa base64
  // convertToBase64(file: File): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });
  // }

  // Metodo per inviare i dati della nuova struttura al backend
  submit() {
    if (!this.selectedFile) {
      alert("Seleziona un'immagine!");
      return;
    }

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
        nomeImmagine: this.selectedFile.name,
        immagineUrl: '', // può essere lasciato vuoto, sarà gestito dal backend
        didascaliaImmagine: this.formData.didascaliaImmagine,
      },
    };

    const formDataToSend = new FormData();
    formDataToSend.append('dto', JSON.stringify(strutturaDTO));
    formDataToSend.append('file', this.selectedFile, this.selectedFile.name);

    this.sendData(formDataToSend);
  }

  sendData(dataToSend: any) {
    this.servizoHttp.sendStruttura(dataToSend).subscribe({
      next: (res) => {
        alert('Struttura creata con successo!');
      },
      error: (err) => {
        console.error('Errore upload', err);

        let errorMsg = 'Errore nel caricamento, riprova.';

        if (err.error) {
          if (typeof err.error === 'string') {
            // se è una semplice stringa
            errorMsg = err.error;
          } else if (err.error.message) {
            // se c'è una proprietà
            errorMsg = err.error.message;
          } else if (err.error.errors) {
            // se ci sono più errori li concatena
            errorMsg = Object.values(err.error.errors).flat().join('\n');
          }
        }

        alert(`Errore nel caricamento: \n${errorMsg}`);
      },
    });
  }
}
