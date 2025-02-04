import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Importing TipoRecapito
import { Recapito } from 'src/app/_type/_Admin/recapiti.type'; // Importing Recapito

@Component({
  selector: 'app-modifica-recapiti-utente', // Kept the selector unchanged
  templateUrl: './modifica-recapiti-utente.component.html', // Kept the template URL unchanged
  styleUrls: ['./modifica-recapiti-utente.component.scss'] // Kept the style URL unchanged
})
export class ModificaRecapitiComponent implements OnInit, OnDestroy, OnChanges {
  elencoTipologie$: Observable<IRispostaServer>;
  tipologie: TipoRecapito[] = []; // Changed to store TipoRecapito[]
  recapiti: Recapito[] = []; // Store Recapito[]
  private distruggi$ = new Subject<void>();

  // Form fields
  @Input() recapito: Recapito | null = null; // Changed from TipoRecapito to Recapito
  newIdTipoRecapito: number | null = null; // New property for Tipo Recapito ID
  newRecapito: string = ''; // Property for the recapito
  isFormVisible: boolean = true;

  constructor(private api: ApiService) {
    // Initialize the observable for TipoRecapito data
    this.elencoTipologie$ = this.api.getTipoRecapito().pipe( // Assuming this method returns TipoRecapito[]
      takeUntil(this.distruggi$),
      tap(response => {
        this.tipologie = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    this.elencoTipologie$.subscribe({
      next: (response) => {
        this.tipologie = response.data; // Assuming response has a data property
      },
      error: (err) => console.error('Error fetching address types:', err) // Updated error message
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recapito'] && this.recapito) {
      this.populateFormFields(this.recapito);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  private populateFormFields(recapito: Recapito): void { // Changed from TipoRecapito to Recapito
    this.newIdTipoRecapito = recapito.idTipoRecapito; // Set the Tipo Recapito ID
    this.newRecapito = recapito.recapito; // Set the recapito value
  }

  modificaValore(
    idRecapito: number,
    newIdTipoRecapito?: number | null,
    newRecapito?: string
  ) {
    console.log("MODIFICA VALORE ", idRecapito, newIdTipoRecapito, newRecapito);

    if (idRecapito !== null) {
      const parametro: Partial<Recapito> = { // Changed from TipoRecapito to Recapito
        ...(newIdTipoRecapito !== undefined ? { idTipoRecapito: newIdTipoRecapito } : {}),
        ...(newRecapito !== undefined ? { recapito: newRecapito } : {}),
      };

      this.obsModRecapito(idRecapito, parametro).subscribe({
        next: (response) => {
          console.log('Recapito modified:', response);
          // Update the local data accordingly
          const index = this.recapiti.findIndex(recapito => recapito.idRecapito === idRecapito); // Changed from idTipoRecapito to idRecapito
          if (index !== -1) {
            // Update the local data with the new values
            this.recapiti[index] = { ...this.recapiti[index], ...parametro };
          }
          this.isFormVisible = false; // Hide the form after modification
        },
        error: (err) => console.error('Error modifying recapito:', err) // Updated error message
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  // Observable for modifying an existing recapito
  obsModRecapito(id: number, dati: Partial<Recapito>) { // Changed from obsModTipologia to obsModRecapito
    return this.api.putRecapiti(id, dati).pipe( // Assuming this method is valid for updating Recapito
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }
}