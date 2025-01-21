import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Changed from TipologieIndirizzi to TipoRecapito

@Component({
  selector: 'app-cancella-tipoRecapito',
  templateUrl: './cancella-tipoRecapito.component.html',
  styleUrls: ['./cancella-tipoRecapito.component.scss']
})
export class CancellaTipoRecapitoComponent implements OnInit, OnDestroy {

  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipoRecapito[] = []; // Changed from TipologieIndirizzi[] to TipoRecapito[]
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() tipologia: TipoRecapito | null = null; // Changed from TipologieIndirizzi to TipoRecapito

  constructor(private api: ApiService) {
    // Initialize the observable for address type data
    this.elencoTipologie$ = this.api.getTipoRecapito().pipe( // Changed to getTipologieRecapito
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoTipologie$ if not using async pipe in the template
    this.elencoTipologie$.subscribe({
      error: (err) => console.error('Error fetching address types:', err) // Updated error message
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
      this.obsDelTipologia(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(tipologia => tipologia.idTipoRecapito !== id); // Update to filter by idTipoRecapito
        },
        error: (err) => console.error('Error deleting address type:', err)
      });
    }
  }

  obsDelTipologia(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteTipoRecapito(idRisorsa).pipe( // Changed to deleteTipologieRecapito
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}