import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Film } from 'src/app/_type/_Admin/Film.type'; // Assuming you have a film type defined

@Component({
  selector: 'app-lista-film',
  templateUrl: './lista-film.component.html',
  styleUrls: ['./lista-film.component.scss']
})
export class ListaFilmComponent implements OnInit {
  elencoFilm$: Observable<IRispostaServer>;
  dati: Film[] = [];
  private distruggi$ = new Subject<void>();

  // Output event emitter to notify parent component
  @Output() filmSelected = new EventEmitter<{ action: string, film: Film }>(); // Changed from serie to film

  constructor(private api: ApiService) {
    this.elencoFilm$ = this.api.getFilm().pipe( // Changed to getFilm
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    this.elencoFilm$.subscribe({
      error: (err) => console.error('Error fetching films:', err) // Updated error message
    });
  }

  editFilm(film: Film) { // Changed from editSerie to editFilm
    // Emit the selected film for modification
    this.filmSelected.emit({ action: 'modifica', film }); // Changed from serie to film
  }

  deleteFilm(id: number) { // Changed from deleteSerie to deleteFilm
    // Call the delete method directly
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteFilm(id.toString()).subscribe({ // Changed to deleteFilm
      next: () => {
        console.log("Film deleted:", id); // Updated log message
        // Remove the deleted film from the local data array
        this.dati = this.dati.filter(film => film.idFilm !== id); // Changed from idSerieTv to idFilm
      },
      error: (err) => console.error('Error deleting film:', err) // Updated error message
    });
  }
}