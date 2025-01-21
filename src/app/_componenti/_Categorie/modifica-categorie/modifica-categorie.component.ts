import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';

@Component({
  selector: 'app-modifica-categorie',
  templateUrl: './modifica-categorie.component.html',
  styleUrls: ['./modifica-categorie.component.scss']
})
export class ModificaCategorieComponent implements OnInit, OnDestroy, OnChanges {
  elencoCategorie$: Observable<IRispostaServer>;
  dati: Categoria[] = []; // Changed from Episodi[] to Categoria[]
  private distruggi$ = new Subject<void>();
  // Form fields
  @Input() categoria: Categoria | null = null; // Changed from episodio to categoria
  newNome: string = ''; // Changed from newTitolo to newNome
  isFormVisible: boolean = true;

  constructor(private api: ApiService) {
    // Initialize the observable for category data
    this.elencoCategorie$ = this.api.getCategorie().pipe( // Changed to getCategorie
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoCategorie$ if not using async pipe in the template
    this.elencoCategorie$.subscribe({
      error: (err) => console.error('Error fetching categories:', err) // Updated error message
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoria'] && this.categoria) {
      this.populateFormFields(this.categoria);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  private populateFormFields(categoria: Categoria): void { // Changed from episodio to categoria
    this.newNome = categoria.nome; // Changed from episodio.titolo to categoria.nome
  }

  modificaValore(
    idCategoria: number,
    newNome?: string
  ) {
    console.log("MODIFICA VALORE ", idCategoria, newNome);

    if (idCategoria !== null) {
      const parametro: Partial<Categoria> = { // Changed from Episodi to Categoria
        ...(newNome !== undefined ? { nome: newNome } : {}),
      };

      this.obsModCategoria(idCategoria, parametro).subscribe({
        next: (response) => {
          console.log('Categoria modified:', response);
          // Update the local data accordingly
          const index = this.dati.findIndex(categoria => categoria.idCategoria === idCategoria); // Changed from idEpisodio to idCategoria
          if (index !== -1) {
            // Update the local data with the new values
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false; // Hide the form after modification
          location.reload(); // Reload the page to refresh the categories list
        },
        error: (err) => console.error('Error modifying category:', err) // Updated error message
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  // Observable for modifying an existing category
  obsModCategoria(id: number, dati: Partial<Categoria>) { // Changed from obsModEpisodio to obsModCategoria
    return this.api.putCategorie(id, dati).pipe( // Changed to putCategorie
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }
}