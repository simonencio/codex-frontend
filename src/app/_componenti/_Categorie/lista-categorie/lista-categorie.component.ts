import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Categoria } from 'src/app/_type/_Admin/categorie.type'; // Changed from Episodi to Categoria

@Component({
  selector: 'app-lista-categorie',
  templateUrl: './lista-categorie.component.html',
  styleUrls: ['./lista-categorie.component.scss']
})
export class ListaCategorieComponent implements OnInit {
  elencoCategorie$: Observable<IRispostaServer>;
  dati: Categoria[] = []; // Changed from Episodi[] to Categoria[]
  private distruggi$ = new Subject<void>();

  // Output event emitter to notify parent component
  @Output() categoriaSelected = new EventEmitter<{ action: string, categoria: Categoria }>(); // Changed from episodio to categoria

  constructor(private api: ApiService) {
    this.elencoCategorie$ = this.api.getCategorie().pipe( // Changed to getCategorie
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    this.elencoCategorie$.subscribe({
      error: (err) => console.error('Error fetching categories:', err) // Updated error message
    });
  }

  editCategoria(categoria: Categoria) { // Changed from editEpisodio to editCategoria
    // Emit the selected category for modification
    this.categoriaSelected.emit({ action: 'modifica', categoria }); // Changed from episodio to categoria
  }

  deleteCategoria(id: number) { // Changed from deleteEpisodio to deleteCategoria
    // Call the delete method directly
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteCategorie(id.toString()).subscribe({ // Changed to deleteCategorie
      next: () => {
        console.log("Categoria deleted:", id); // Updated log message
        // Remove the deleted category from the local data array
        this.dati = this.dati.filter(categoria => categoria.idCategoria !== id); // Changed from idEpisodio to idCategoria
      },
      error: (err) => console.error('Error deleting category:', err) // Updated error message
    });
  }
}