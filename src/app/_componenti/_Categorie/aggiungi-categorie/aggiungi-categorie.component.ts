import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';

@Component({
  selector: 'app-aggiungi-categorie', // Changed from app-aggiungi-episodio to app-aggiungi-categorie
  templateUrl: './aggiungi-categorie.component.html', // Changed from aggiungi-episodio.component.html to aggiungi-categorie.component.html
  styleUrls: ['./aggiungi-categorie.component.scss'] // Changed from aggiungi-episodio.component.scss to aggiungi-categorie.component.scss
})
export class AggiungiCategorieComponent implements OnInit, OnDestroy {
  elencoCategorie$: Observable<IRispostaServer>;
  dati: Categoria[] = []; // Changed from Episodi[] to Categoria[]
  private distruggi$ = new Subject<void>();
  // New properties for form inputs
  newIdCategoria: number | null = null; // Changed from newIdSerieTv to newIdCategoria
  newNome: string = ''; // Changed from newTitolo to newNome
  isFormVisible: boolean = true; // Added property to control form visibility

  constructor(private api: ApiService) {
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

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  // Add a new category
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<Categoria> = {
      idCategoria: this.newIdCategoria !== null ? this.newIdCategoria : undefined, // Assign undefined if null
      nome: this.newNome,
    };

    // Call the observable to add the new category
    this.obsAddCategoria(parametro).subscribe({
      next: (response) => {
        console.log('Categoria aggiunta:', response);
        this.dati.push(response); // Assuming response contains the added category
        this.resetForm(); // Reset the form fields after adding
        location.reload(); // Reload the page to refresh the categories list
      },
      error: (err) => console.error('Error adding category:', err)
    });
  }

  // Observable for adding a new category
  obsAddCategoria(dati: Partial<Categoria>) {
    return this.api.postCategorie(dati).pipe( // Changed to postCategorie
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }

  // Method to reset the form fields
  resetForm() {
    this.newIdCategoria = null; // Resetting the newIdCategoria
    this.newNome = ''; // Resetting the newNome
  }
}