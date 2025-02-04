import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Importing TipoRecapito type

@Component({
  selector: 'app-aggiungi-tipoRecapito', // Updated selector
  templateUrl: './aggiungi-tipoRecapito.component.html', // Updated template URL
  styleUrls: ['./aggiungi-tipoRecapito.component.scss'] // Updated style URL
})
export class AggiungiTipoRecapitoComponent implements OnInit, OnDestroy {
  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipoRecapito[] = []; // Changed from TipologieIndirizzi[] to TipoRecapito[]
  private distruggi$ = new Subject<void>();

  // New properties for form inputs
  newIdTipoRecapito: number | null = null; // New property for Tipo Recapito ID
  newNome: string = ''; // Property for the name of the Tipo Recapito
  isFormVisible: boolean = true; // Property to control form visibility

  constructor(private api: ApiService) {
    this.elencoTipologie$ = this.api.getTipoRecapito().pipe( // Changed to getTipologieRecapito
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
    const parametro: Partial<TipoRecapito> = {
      idTipoRecapito: this.newIdTipoRecapito !== null ? this.newIdTipoRecapito : undefined, // Assign undefined if null
      nome: this.newNome,
    };

    // Call the observable to add the new address type
    this.obsAddTipoRecapito(parametro).subscribe({
      next: (response) => {
        console.log('Tipo Recapito aggiunto:', response);
        this.dati.push(response); // Assuming response contains the added address type
        this.resetForm(); // Reset the form fields after adding
      },
      error: (err) => console.error('Error adding address type:', err)
    });
  }

  // Observable for adding a new address type
  obsAddTipoRecapito(dati: Partial<TipoRecapito>) {
    return this.api.postTipoRecapito(dati).pipe( // Changed to postTipologieRecapito
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }

  // Method to reset the form fields
  resetForm() {
    this.newIdTipoRecapito = null; // Resetting the newIdTipoRecapito
    this.newNome = ''; // Resetting the newNome
  }
}