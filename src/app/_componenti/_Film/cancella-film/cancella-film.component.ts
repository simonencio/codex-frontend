import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Film } from 'src/app/_type/_Admin/Film.type'; // Assuming you have a film type defined

@Component({
  selector: 'app-cancella-film',
  templateUrl: './cancella-film.component.html',
  styleUrls: ['./cancella-film.component.scss']
})
export class CancellaFilmComponent implements OnInit, OnDestroy {

  elencoFilm$: Observable<IRispostaServer>;
  dati: Film[] = [];
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() film: Film | null = null;

  constructor(private api: ApiService) {
    // Initialize the observable for film data
    this.elencoFilm$ = this.api.getFilm().pipe( // Assuming you have a method to get films
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoFilm$ if not using async pipe in the template
    this.elencoFilm$.subscribe({
      error: (err) => console.error('Error fetching films:', err)
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
      this.obsDelFilm(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(film => film.idFilm !== id); // Update to filter by idFilm
        },
        error: (err) => console.error('Error deleting film:', err)
      });
    }
  }

  obsDelFilm(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteFilm(idRisorsa).pipe( // Assuming you have a method to delete films
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}