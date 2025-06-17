import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ServizoHttp } from '../../../services/servizo-http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-crea-struttura',
  imports: [FormsModule],
  templateUrl: './crea-struttura.html',
  styleUrl: './crea-struttura.css',
})
export class CreaStruttura {
  formData: any = {
    nomeStruttura: '',
    ambito: '',
    citta: '',
    provincia: '',
    via: '',
    descrizione: '',
    testiSemplici: '',
    posizione: '',
    social: '',
  };

  base64Image: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private servizoHttp: ServizoHttp,
    private cdr: ChangeDetectorRef
  ) {}

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
      NomeStruttura: this.formData.nomeStruttura,
      Ambito: this.formData.ambito,
      Citta: this.formData.citta,
      Provincia: this.formData.provincia,
      Via: this.formData.via,
      IndirizzoCompleto: 'indirizzo',
      Descrizione: this.formData.descrizione,
      TestoSemplificato: this.formData.testiSemplici,
      Posizione: this.formData.posizione,
      Social1: this.formData.social,
      Social2: '',
      sitoWeb: '',
      ByteImmagine: this.base64Image,
      NomeImmagine: this.selectedFile?.name || 'image.jpg',
      DataInserimento: new Date().toISOString(),
      FlgDisabilita: false,
      DidascaliaImmagine: "Immagine caricata dall'utente",
    };

    this.servizoHttp.sendData(dataToSend).subscribe({
      next: (res) => {
        console.log('Upload riuscito', res);
        alert('Struttura creata con successo!');
      },
      error: (err) => {
        console.error('Errore upload', err);
        if (err.error && err.error.errors) {
          console.error('Dettagli errori validazione:', err.error.errors);
        }
        alert('Errore nel caricamento, riprova.');
      },
    });
  }
}
