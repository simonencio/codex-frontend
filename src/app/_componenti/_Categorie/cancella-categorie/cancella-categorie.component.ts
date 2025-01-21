import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';

@Component({
  selector: 'app-cancella-categorie',
  templateUrl: './cancella-categorie.component.html',
  styleUrls: ['./cancella-categorie.component.scss']
})
export class CancellaCategorieComponent implements OnInit, OnDestroy {

  elencoCategorie$: Observable<IRispostaServer>;
  dati: Categoria[] = []; // Changed from Episodi[] to Categoria[]
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() categoria: Categoria | null = null; // Changed from Episodi to Categoria

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

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  cancellaValore(id: number | null) {
    console.log("CANCELLA VALORE ", id);
    if (id !== null) {
      this.obsDelCategoria(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(categoria => categoria.idCategoria !== id); // Update to filter by idCategoria
        },
        error: (err) => console.error('Error deleting category:', err)
      });
    }
  }

  obsDelCategoria(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteCategorie(idRisorsa).pipe( // Changed to deleteCategorie
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}