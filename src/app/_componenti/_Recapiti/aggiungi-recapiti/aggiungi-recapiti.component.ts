import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Importing TipoRecapito type
import { Recapito } from 'src/app/_type/_Admin/recapiti.type'; // Importing Recapito type

@Component({
  selector: 'app-aggiungi-recapiti', // Updated selector
  templateUrl: './aggiungi-recapiti.component.html', // Updated template URL
  styleUrls: ['./aggiungi-recapiti.component.scss'] // Updated style URL
})
export class AggiungiRecapitiComponent implements OnInit, OnDestroy {
  elencoTipologie$: Observable<IRispostaServer>;
  dati: Recapito[] = []; // Changed from TipoRecapito[] to Recapito[]
  private distruggi$ = new Subject<void>();

  // New properties for form inputs
  newIdRecapito: number | null = null; // New property for Recapito ID
  newIdTipoRecapito: number | null = null; // New property for Tipo Recapito ID
  newRecapito: string = ''; // Property for the recapito
  newIdContatto: number | null = null; // New property for ID Contatto
  isFormVisible: boolean = true; // Property to control form visibility
  tipologie: TipoRecapito[] = []; // Store the list of TipoRecapito

  constructor(private api: ApiService) {
    this.elencoTipologie$ = this.api.getTipoRecapito().pipe( // Changed to getTipoRecapito
      takeUntil(this.distruggi$),
      tap(response => {
        this.tipologie = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoTipologie$ if not using async pipe in the template
    this.elencoTipologie$.subscribe({
      error: (err) => console.error('Error fetching address types:', err) // Updated error message
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  // Add a new recapito
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<Recapito> = {
      idRecapito: this.newIdRecapito !== null ? this.newIdRecapito : undefined, // Assign undefined if null
      idTipoRecapito: this.newIdTipoRecapito !== null ? this.newIdTipoRecapito : undefined, // Assign undefined if null
      recapito: this.newRecapito,
      idContatto: this.newIdContatto !== null ? this.newIdContatto : undefined // Include idContatto
    };

    // Call the observable to add the new recapito
    this.obsAddRecapito(parametro).subscribe({
      next: (response) => {
        console.log('Recapito aggiunto:', response);
        this.dati.push(response); // Assuming response contains the added recapito
        this.resetForm(); // Reset the form fields after adding
      },
      error: (err) => console.error('Error adding recapito:', err)
    });
  }

  // Observable for adding a new recapito
  obsAddRecapito(dati: Partial<Recapito>) {
    return this.api.postRecapiti(dati).pipe( // Changed to postRecapito
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }

  // Method to reset the form fields
  resetForm() {
    this.newIdRecapito = null; // Resetting the newIdRecapito
    this.newIdTipoRecapito = null; // Resetting the newIdTipoRecapito
    this.newRecapito = ''; // Resetting the newRecapito
    this.newIdContatto = null; // Resetting the newIdContatto
  }
}