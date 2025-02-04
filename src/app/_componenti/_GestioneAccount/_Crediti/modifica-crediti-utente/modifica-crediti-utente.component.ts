import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Credito } from 'src/app/_type/_Admin/crediti.type'; // Changed to Credito

@Component({
  selector: 'app-modifica-crediti-utente', // Kept the selector unchanged
  templateUrl: './modifica-crediti-utente.component.html', // Kept the template URL unchanged
  styleUrls: ['./modifica-crediti-utente.component.scss'] // Kept the style URL unchanged
})
export class ModificaCreditoComponent implements OnInit, OnDestroy, OnChanges {
  elencoCrediti$: Observable<IRispostaServer>; // Changed from elencoTipologie$ to elencoCrediti$
  dati: Credito[] = []; // Changed from TipoRecapito[] to Credito[]
  private distruggi$ = new Subject<void>();

  // Form fields
  @Input() credito: Credito | null = null; // Changed from TipoRecapito to Credito
  newCredito: number | null = null; // New property for Credito amount
  isFormVisible: boolean = true;

  constructor(private api: ApiService) {
    // Initialize the observable for credit data
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['credito'] && this.credito) {
      this.populateFormFields(this.credito);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  private populateFormFields(credito: Credito): void { // Changed from TipoRecapito to Credito
    this.newCredito = credito.credito; // Set the Credito amount
  }

  modificaValore(
    idCredito: number,
    newCredito?: number | null
  ) {
    console.log("MODIFICA VALORE ", idCredito, newCredito);

    if (idCredito !== null) {
      const parametro: Partial<Credito> = { // Changed from TipoRecapito to Credito
        ...(newCredito !== undefined ? { credito: newCredito } : {}),
      };

      this.obsModCredito(idCredito, parametro).subscribe({
        next: (response) => {
          console.log('Credito modified:', response);
          // Update the local data accordingly
          const index = this.dati.findIndex(credito => credito.idCredito === idCredito); // Changed from idTipoRecapito to idCredito
          if (index !== -1) {
            // Update the local data with the new values
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false; // Hide the form after modification
        },
        error: (err) => console.error('Error modifying credit:', err) // Updated error message
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  // Observable for modifying an existing credit
  obsModCredito(id: number, dati: Partial<Credito>) { // Changed from obsModTipologia to obsModCredito
    return this.api.putCredito(id, dati).pipe( // Changed to putCrediti
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data)
    );
  }
}