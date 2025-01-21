import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Indirizzi } from 'src/app/_type/_Admin/Indirizzi.type'; // Import Indirizzi type
import { TipologiaIndirizzo } from 'src/app/_type/registrazione/tipologiaIndirizzi.type'; // Import TipologiaIndirizzo type
import { Contatto } from 'src/app/_type/_Admin/Contatto.type'; // Import Contatto type

@Component({
  selector: 'app-lista-indirizzi-utente',
  templateUrl: './lista-indirizzi-utente.component.html',
  styleUrls: ['./lista-indirizzi-utente.component.scss']
})
export class ListaIndirizziComponent implements OnInit {
  elencoIndirizzi$: Observable<IRispostaServer>;
  dati: Indirizzi[] = [];
  private distruggi$ = new Subject<void>();
  tipologieIndirizzi: TipologiaIndirizzo[] = []; // Array to hold tipologiaIndirizzi
  contatti: Contatto[] = []; // Array to hold contatti data
  loggedInIdContatto: number | null = null; // Store the logged-in user's idContatto
  @Output() indirizzoSelected = new EventEmitter<{ action: string, indirizzo: Indirizzi }>();

  constructor(private api: ApiService) {
    this.elencoIndirizzi$ = this.api.getIndirizzi().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
        // Sort the data by idContatto
        this.dati.sort((a, b) => a.idContatto - b.idContatto);
      })
    );
  }

  ngOnInit(): void {
    // Retrieve the logged-in user's idContatto from session storage
    this.loggedInIdContatto = this.getLoggedInIdContatto();

    this.elencoIndirizzi$.subscribe({
      next: () => {
        // Filter the addresses to only include those for the logged-in idContatto
        if (this.loggedInIdContatto !== null) {
          this.dati = this.dati.filter(indirizzo => indirizzo.idContatto === this.loggedInIdContatto);
        }
      },
      error: (err) => console.error('Error fetching addresses:', err)
    });

    this.api.getTipologieIndirizzi().subscribe(tipologie => {
      this.tipologieIndirizzi = tipologie.data; // Assuming the response has a data property
    });

    this.api.getContatto().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.contatti = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching contatti:', err)
    });
  }

  getTipologiaNome(idTipologiaIndirizzo: number): string {
    const tipologia = this.tipologieIndirizzi.find(t => t.idTipologiaIndirizzo === idTipologiaIndirizzo);
    return tipologia ? tipologia.nome : 'Unknown';
  }

  getContattoName(idContatto: number): string {
    const contatto = this.contatti.find(c => c.idContatto === idContatto);
    return contatto ? `${contatto.nome} ${contatto.cognome}` : 'Unknown';
  }

  editIndirizzo(indirizzo: Indirizzi) {
    this.indirizzoSelected.emit({ action: 'modifica', indirizzo });
  }

  deleteIndirizzo(id: number) {
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteIndirizzi(id.toString()).subscribe({
      next: () => {
        console.log("Indirizzo deleted:", id);
        this.dati = this.dati.filter(indirizzo => indirizzo.idIndirizzo !== id);
      }, error: (err) => console.error('Error deleting address:', err)
    });
  }

  // Method to retrieve the logged-in user's idContatto from session storage
  private getLoggedInIdContatto(): number | null {
    const authData = sessionStorage.getItem('auth'); // Assuming the auth data is stored under the key 'auth'
    if (authData) {
      const parsedData = JSON.parse(authData); // Parse the JSON string
      return parsedData.idContatto ? parseInt(parsedData.idContatto, 10) : null; // Convert to number
    }
    return null; // Return null if not found
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }
}