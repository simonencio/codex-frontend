import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Recapito } from 'src/app/_type/_Admin/recapiti.type'; // Importing Recapito type

@Component({
  selector: 'app-cancella-recapiti',
  templateUrl: './cancella-recapiti.component.html',
  styleUrls: ['./cancella-recapiti.component.scss']
})
export class CancellaRecapitiComponent implements OnInit, OnDestroy {

  elencoRecapiti$: Observable<IRispostaServer>; // Changed to reflect Recapito
  dati: Recapito[] = []; // Changed from TipoRecapito[] to Recapito[]
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() recapito: Recapito | null = null; // Changed from TipoRecapito to Recapito

  constructor(private api: ApiService) {
    // Initialize the observable for Recapito data
    this.elencoRecapiti$ = this.api.getRecapiti().pipe( // Assuming this method returns Recapito[]
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoRecapiti$ if not using async pipe in the template
    this.elencoRecapiti$.subscribe({
      error: (err) => console.error('Error fetching recapiti:', err) // Updated error message
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
      this.obsDelRecapito(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(recapito => recapito.idRecapito !== id); // Update to filter by idRecapito
        },
        error: (err) => console.error('Error deleting recapito:', err)
      });
    }
  }

  obsDelRecapito(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteRecapiti(idRisorsa).pipe( // Changed to deleteRecapito
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}