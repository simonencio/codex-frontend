import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Credito } from 'src/app/_type/_Admin/crediti.type'; // Importing Credito type

@Component({
  selector: 'app-aggiungi-crediti', // Updated selector
  templateUrl: './aggiungi-crediti.component.html', // Updated template URL
  styleUrls: ['./aggiungi-crediti.component.scss'] // Updated style URL
})
export class AggiungiCreditoComponent implements OnInit, OnDestroy {
  elencoCrediti$: Observable<IRispostaServer>; // Changed from elencoTipologie$ to elencoCrediti$
  dati: Credito[] = []; // Changed from TipoRecapito[] to Credito[]
  private distruggi$ = new Subject<void>();

  // New properties for form inputs
  newIdCredito: number | null = null; // New property for Credito ID
  newIdContatto: number | null = null; // New property for Contatto ID
  newCredito: number | null = null; // New property for Credito amount
  isFormVisible: boolean = true; // Property to control form visibility

  constructor(private api: ApiService) {
    this.elencoCrediti$ = this.api.getCredito().pipe( // Changed to getCrediti
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoCrediti$ if not using async pipe in the template
    this.elencoCrediti$.subscribe({
      error: (err) => console.error('Error fetching credits:', err) // Updated error message
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  // Add a new credit
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<Credito> = {
      idCredito: this.newIdCredito !== null ? this.newIdCredito : undefined, // Assign undefined if null
      idContatto: this.newIdContatto !== null ? this.newIdContatto : undefined, // Assign undefined if null
      credito: this.newCredito !== null ? this.newCredito : undefined, // Assign undefined if null
    };

    // Call the observable to add the new credit
    this.obsAddCredito(parametro).subscribe({
      next: (response) => {
        console.log('Credito aggiunto:', response);
        this.dati.push(response); // Assuming response contains the added credit
        this.resetForm(); // Reset the form fields after adding
        location.reload(); // Reload the page to refresh the credits list
      },
      error: (err) => console.error('Error adding credit:', err)
    });
  }

  // Observable for adding a new credit
  obsAddCredito(dati: Partial<Credito>) {
    return this.api.postCredito(dati).pipe( // Changed to postCrediti
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }

  // Method to reset the form fields
  resetForm() {
    this.newIdCredito = null; // Resetting the newIdCredito
    this.newIdContatto = null; // Resetting the newIdContatto
    this.newCredito = null; // Resetting the newCredito
  }
}