import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { SerieTv } from 'src/app/_type/_Admin/serieTv.type';

@Component({
  selector: 'app-cancella-serie-tv',
  templateUrl: './cancella-serie-tv.component.html',
  styleUrls: ['./cancella-serie-tv.component.scss']
})
export class CancellaSerieTvComponent implements OnInit, OnDestroy {

  elencoSerie$: Observable<IRispostaServer>;
  dati: SerieTv[] = [];
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() serie: SerieTv | null = null;



  constructor(private api: ApiService) {
    // Initialize the observable for series data
    this.elencoSerie$ = this.api.getSerieTv().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoSerie$ if not using async pipe in the template
    this.elencoSerie$.subscribe({
      error: (err) => console.error('Error fetching series:', err)
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
      this.obsDelSerieTv(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(serie => serie.idSerieTv !== id);
        },
        error: (err) => console.error('Error deleting series:', err)
      });
    }
  }
  obsDelSerieTv(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteSerieTv(idRisorsa).pipe(
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}
