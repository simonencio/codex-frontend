import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { TipologieIndirizzi } from 'src/app/_type/_Admin/tipologieIndirizzi.type'; // Changed from Categoria to TipologieIndirizzi

@Component({
  selector: 'app-cancella-tipologieIndirizzi',
  templateUrl: './cancella-tipologieIndirizzi.component.html',
  styleUrls: ['./cancella-tipologieIndirizzi.component.scss']
})
export class CancellaTipologieIndirizziComponent implements OnInit, OnDestroy {

  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipologieIndirizzi[] = []; // Changed from Categoria[] to TipologieIndirizzi[]
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() tipologia: TipologieIndirizzi | null = null; // Changed from Categoria to TipologieIndirizzi

  constructor(private api: ApiService) {
    // Initialize the observable for address type data
    this.elencoTipologie$ = this.api.getTipologieIndirizzi().pipe( // Changed to getTipologieIndirizzi
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
          this.dati = this.dati.filter(tipologia => tipologia.idTipologiaIndirizzo !== id); // Update to filter by idTipologiaIndirizzo
        },
        error: (err) => console.error('Error deleting address type:', err)
      });
    }
  }

  obsDelTipologia(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteTipologieIndirizzi(idRisorsa).pipe( // Changed to deleteTipologieIndirizzi
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}