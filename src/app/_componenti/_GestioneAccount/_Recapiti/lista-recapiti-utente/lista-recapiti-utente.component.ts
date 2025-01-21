import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Recapito } from 'src/app/_type/_Admin/recapiti.type'; // Import Recapito type
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Import TipoRecapito type
import { Contatto } from 'src/app/_type/_Admin/Contatto.type'; // Import Contatto type

@Component({
  selector: 'app-lista-recapiti-utente',
  templateUrl: './lista-recapiti-utente.component.html',
  styleUrls: ['./lista-recapiti-utente.component.scss']
})
export class ListaRecapitiComponent implements OnInit {
  elencoRecapiti$: Observable<IRispostaServer>;
  dati: Recapito[] = [];
  tipologie: TipoRecapito[] = [];
  contatti: Contatto[] = []; // Array to hold contatti data
  private distruggi$ = new Subject<void>();
  loggedInIdContatto: number | null = null; // Store the logged-in user's idContatto

  @Output() recapitoSelected = new EventEmitter<{ action: string, recapito: Recapito }>();

  constructor(private api: ApiService) {
    this.elencoRecapiti$ = this.api.getRecapiti().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
        // Sort the data by idContatto
        this.dati.sort((a, b) => a.idContatto - b.idContatto);
      })
    );

    this.api.getTipoRecapito().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.tipologie = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching tipo recapito:', err)
    });

    // Fetch contatti data
    this.api.getContatto().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.contatti = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching contatti:', err)
    });
  }

  ngOnInit(): void {
    // Retrieve the logged-in user's idContatto from session storage
    this.loggedInIdContatto = this.getLoggedInIdContatto();

    this.elencoRecapiti$.subscribe({
      next: () => {
        // Filter the recapiti to only include those for the logged-in idContatto
        if (this.loggedInIdContatto !== null) {
          this.dati = this.dati.filter(recapito => recapito.idContatto === this.loggedInIdContatto);
        }
      },
      error: (err) => console.error('Error fetching recapiti:', err)
    });
  }

  editRecapito(recapito: Recapito) {
    this.recapitoSelected.emit({ action: 'modifica', recapito });
  }

  deleteRecapito(id: number) {
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteRecapiti(id.toString()).subscribe({
      next: () => {
        console.log("Recapito deleted:", id);
        this.dati = this.dati.filter(recapito => recapito.idRecapito !== id);
      },
      error: (err) => console.error('Error deleting recapito:', err)
    });
  }

  getTipoRecapitoName(idTipoRecapito: number | null): string {
    const tipo = this.tipologie.find(t => t.idTipoRecapito === idTipoRecapito);
    return tipo ? tipo.nome : 'Unknown';
  }

  getContattoName(idContatto: number): string {
    const contatto = this.contatti.find(c => c.idContatto === idContatto);
    return contatto ? `${contatto.nome} ${contatto.cognome}` : 'Unknown';
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