import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ServizioHttp } from '../../../services/servizio-http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-crea-struttura',
  imports: [FormsModule,CommonModule],
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
    IndirizzoCompleto:'',
    posizione: '',
    Instagram: '',
    Facebook:'',
    sitoWeb:'',
    didascaliaImmagine:'',
  };

    // Variabili per la gestione dell'immagine
  base64Image: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private servizoHttp: ServizioHttp,
    private cdr: ChangeDetectorRef
  ) {}

    // Metodo chiamato al caricamento di un file: converte l'immagine in base64
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.convertToBase64(file)
        .then((base64) => {
          this.base64Image = base64.split(',')[1];
          this.selectedFile = file; 
          this.cdr.detectChanges(); // Forza il rilevamento dei cambiamenti
        })
        .catch((err) => {
          console.error('Errore conversione file:', err);
        });
    }
  }

   // Metodo per convertire un file immagine in una stringa base64
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // Metodo per inviare i dati della nuova struttura al backend
  submit() {
    if (!this.base64Image) {
      console.error('Nessuna immagine selezionata');
      return;
    }

    const dataToSend = {
      NomeStruttura: this.formData.nomeStruttura,
      Ambito: this.formData.ambito,
      Citta: this.formData.citta,
      Provincia: this.formData.provincia,
      Via: this.formData.via,
      IndirizzoCompleto: this.formData.IndirizzoCompleto,
      Descrizione: this.formData.descrizione,
      TestoSemplificato: this.formData.testiSemplici,
      Posizione: this.formData.posizione,
      Social1: this.formData.Instagram,
      Social2: this.formData.Facebook,
      SitoWeb: this.formData.sitoWeb,
      DataInserimento: new Date().toISOString(),
      FlgDisabilita: false,
      Immagine:{
        ByteImmagine: this.base64Image,
        NomeImmagine: this.selectedFile?.name || 'errore',
        DidascaliaImmagine: this.formData.didascaliaImmagine,
      }
    };



     this.sendData(dataToSend);
  }


  sendData(dataToSend:any){

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
        errorMsg = Object.values(err.error.errors)
          .flat()
          .join('\n');
      }
    }

    alert(`Errore nel caricamento: \n${errorMsg}`);
  },
});
  }
}
