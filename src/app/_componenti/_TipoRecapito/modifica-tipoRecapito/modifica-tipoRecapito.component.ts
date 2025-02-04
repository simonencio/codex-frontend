import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Changed to TipoRecapito

@Component({
  selector: 'app-modifica-tipoRecapito', // Kept the selector unchanged
  templateUrl: './modifica-tipoRecapito.component.html', // Kept the template URL unchanged
  styleUrls: ['./modifica-tipoRecapito.component.scss'] // Kept the style URL unchanged
})
export class ModificaTipoRecapitoComponent implements OnInit, OnDestroy, OnChanges {
  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipoRecapito[] = []; // Changed from TipologieIndirizzi[] to TipoRecapito[]
  private distruggi$ = new Subject<void>();

  // Form fields
  @Input() tipologia: TipoRecapito | null = null; // Changed from TipologieIndirizzi to TipoRecapito
  newNome: string = ''; // Kept as newNome
  isFormVisible: boolean = true;

  constructor(private api: ApiService) {
    // Initialize the observable for address type data
    this.elencoTipologie$ = this.api.getTipoRecapito().pipe( // Assuming this method returns TipoRecapito[]
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipologia'] && this.tipologia) {
      this.populateFormFields(this.tipologia);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  private populateFormFields(tipologia: TipoRecapito): void { // Changed from TipologieIndirizzi to TipoRecapito
    this.newNome = tipologia.nome; // Changed from categoria.nome to tipologia.nome
  }

  modificaValore(
    idTipoRecapito: number,
    newNome?: string
  ) {
    console.log("MODIFICA VALORE ", idTipoRecapito, newNome);

    if (idTipoRecapito !== null) {
      const parametro: Partial<TipoRecapito> = { // Changed from TipologieIndirizzi to TipoRecapito
        ...(newNome !== undefined ? { nome: newNome } : {}),
      };

      this.obsModTipologia(idTipoRecapito, parametro).subscribe({
        next: (response) => {
          console.log('Tipo Recapito modified:', response);
          // Update the local data accordingly
          const index = this.dati.findIndex(tipologia => tipologia.idTipoRecapito === idTipoRecapito); // Changed from idTipologiaIndirizzo to idTipoRecapito
          if (index !== -1) {
            // Update the local data with the new values
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false; // Hide the form after modification
          location.reload(); // Reload the page to refresh the address types list
        },
        error: (err) => console.error('Error modifying address type:', err) // Updated error message
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  // Observable for modifying an existing address type
  obsModTipologia(id: number, dati: Partial<TipoRecapito>) { // Changed from obsModTipologia to obsModTipologia
    return this.api.putTipoRecapito(id, dati).pipe( // Assuming this method is still valid
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }
}