import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipologieIndirizzi } from 'src/app/_type/_Admin/tipologieIndirizzi.type'; // Importing TipologieIndirizzi type

@Component({
  selector: 'app-aggiungi-tipologieIndirizzi', // Updated selector
  templateUrl: './aggiungi-tipologieIndirizzi.component.html', // Updated template URL
  styleUrls: ['./aggiungi-tipologieIndirizzi.component.scss'] // Updated style URL
})
export class AggiungiTipologieIndirizziComponent implements OnInit, OnDestroy {
  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipologieIndirizzi[] = []; // Changed from Categoria[] to TipologieIndirizzi[]
  private distruggi$ = new Subject<void>();

  // New properties for form inputs
  newIdTipologiaIndirizzo: number | null = null; // New property for Tipologia Indirizzo ID
  newNome: string = ''; // Property for the name of the Tipologia Indirizzo
  isFormVisible: boolean = true; // Property to control form visibility

  constructor(private api: ApiService) {
    this.elencoTipologie$ = this.api.getTipologieIndirizzi().pipe( // Changed to getTipologieIndirizzi
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
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

  // Add a new address type
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<TipologieIndirizzi> = {
      idTipologiaIndirizzo: this.newIdTipologiaIndirizzo !== null ? this.newIdTipologiaIndirizzo : undefined, // Assign undefined if null
      nome: this.newNome,
    };

    // Call the observable to add the new address type
    this.obsAddTipologia(parametro).subscribe({
      next: (response) => {
        console.log('Tipologia Indirizzo aggiunta:', response);
        this.dati.push(response); // Assuming response contains the added address type
        this.resetForm(); // Reset the form fields after adding
        location.reload(); // Reload the page to refresh the address types list
      },
      error: (err) => console.error('Error adding address type:', err)
    });
  }

  // Observable for adding a new address type
  obsAddTipologia(dati: Partial<TipologieIndirizzi>) {
    return this.api.postTipologieIndirizzi(dati).pipe( // Changed to postTipologieIndirizzi
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }

  // Method to reset the form fields
  resetForm() {
    this.newIdTipologiaIndirizzo = null; // Resetting the newIdTipologiaIndirizzo
    this.newNome = ''; // Resetting the newNome
  }
}