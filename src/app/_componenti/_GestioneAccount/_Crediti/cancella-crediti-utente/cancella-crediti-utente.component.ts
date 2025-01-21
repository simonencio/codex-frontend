import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Credito } from 'src/app/_type/_Admin/crediti.type'; // Changed to Credito

@Component({
  selector: 'app-cancella-crediti-utente',
  templateUrl: './cancella-crediti-utente.component.html',
  styleUrls: ['./cancella-crediti-utente.component.scss']
})
export class CancellaCreditoComponent implements OnInit, OnDestroy {

  elencoCrediti$: Observable<IRispostaServer>; // Changed from elencoTipologie$ to elencoCrediti$
  dati: Credito[] = []; // Changed from TipoRecapito[] to Credito[]
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() credito: Credito | null = null; // Changed from TipoRecapito to Credito

  constructor(private api: ApiService) {
    // Initialize the observable for credit data
    this.elencoCrediti$ = this.api.getCredito().pipe( // Changed to getCrediti
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoCrediti$ if not using async pipe in the template
    this.elencoCrediti$.subscribe({
      error: (err) => console.error('Error fetching credits:', err) // Updated error message
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
      this.obsDelCredito(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(credito => credito.idCredito !== id); // Update to filter by idCredito
        },
        error: (err) => console.error('Error deleting credit:', err)
      });
    }
  }

  obsDelCredito(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteCredito(idRisorsa).pipe( // Changed to deleteCredito
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}