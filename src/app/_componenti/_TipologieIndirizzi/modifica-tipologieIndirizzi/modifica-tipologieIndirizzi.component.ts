import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipologieIndirizzi } from 'src/app/_type/_Admin/tipologieIndirizzi.type'; // Changed from Categoria to TipologieIndirizzi

@Component({
  selector: 'app-modifica-tipologieIndirizzi', // Kept the selector unchanged
  templateUrl: './modifica-tipologieIndirizzi.component.html', // Kept the template URL unchanged
  styleUrls: ['./modifica-tipologieIndirizzi.component.scss'] // Kept the style URL unchanged
})
export class ModificaTipologieIndirizziComponent implements OnInit, OnDestroy, OnChanges {
  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipologieIndirizzi[] = []; // Changed from Categoria[] to TipologieIndirizzi[]
  private distruggi$ = new Subject<void>();

  // Form fields
  @Input() tipologia: TipologieIndirizzi | null = null; // Changed from categoria to tipologia
  newNome: string = ''; // Kept as newNome
  isFormVisible: boolean = true;

  constructor(private api: ApiService) {
    // Initialize the observable for address type data
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

  private populateFormFields(tipologia: TipologieIndirizzi): void { // Changed from categoria to tipologia
    this.newNome = tipologia.nome; // Changed from categoria.nome to tipologia.nome
  }

  modificaValore(
    idTipologiaIndirizzo: number,
    newNome?: string
  ) {
    console.log("MODIFICA VALORE ", idTipologiaIndirizzo, newNome);

    if (idTipologiaIndirizzo !== null) {
      const parametro: Partial<TipologieIndirizzi> = { // Changed from Categoria to TipologieIndirizzi
        ...(newNome !== undefined ? { nome: newNome } : {}),
      };

      this.obsModTipologia(idTipologiaIndirizzo, parametro).subscribe({
        next: (response) => {
          console.log('Tipologia Indirizzo modified:', response);
          // Update the local data accordingly
          const index = this.dati.findIndex(tipologia => tipologia.idTipologiaIndirizzo === idTipologiaIndirizzo); // Changed from idCategoria to idTipologiaIndirizzo
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
  obsModTipologia(id: number, dati: Partial<TipologieIndirizzi>) { // Changed from obsModCategoria to obsModTipologia
    return this.api.putTipologieIndirizzi(id, dati).pipe( // Changed to putTipologieIndirizzi
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }
}