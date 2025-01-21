import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Episodi } from 'src/app/_type/_Admin/episodi.type';

@Component({
  selector: 'app-cancella-episodi',
  templateUrl: './cancella-episodi.component.html',
  styleUrls: ['./cancella-episodi.component.scss']
})
export class CancellaEpisodiComponent implements OnInit, OnDestroy {

  elencoEpisodi$: Observable<IRispostaServer>;
  dati: Episodi[] = [];
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() episodio: Episodi | null = null; // Change from Film to Episodi

  constructor(private api: ApiService) {
    // Initialize the observable for episode data
    this.elencoEpisodi$ = this.api.getEpisodi().pipe( // Assuming you have a method to get episodes
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoEpisodi$ if not using async pipe in the template
    this.elencoEpisodi$.subscribe({
      error: (err) => console.error('Error fetching episodes:', err)
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
      this.obsDelEpisodio(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(episodio => episodio.idEpisodio !== id); // Update to filter by idEpsiodio
        },
        error: (err) => console.error('Error deleting episode:', err)
      });
    }
  }

  obsDelEpisodio(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteEpisodi(idRisorsa).pipe( // Assuming you have a method to delete episodes
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}