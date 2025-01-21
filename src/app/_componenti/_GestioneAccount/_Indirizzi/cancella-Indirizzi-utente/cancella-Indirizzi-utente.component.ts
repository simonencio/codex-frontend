import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Indirizzi } from 'src/app/_type/_Admin/Indirizzi.type'; // Changed from TipologieIndirizzi to Indirizzi

@Component({
  selector: 'app-cancella-Indirizzi-utente',
  templateUrl: './cancella-Indirizzi-utente.component.html',
  styleUrls: ['./cancella-Indirizzi-utente.component.scss']
})
export class CancellaIndirizziComponent implements OnInit, OnDestroy {

  elencoIndirizzi$: Observable<IRispostaServer>;
  dati: Indirizzi[] = []; // Changed from TipologieIndirizzi[] to Indirizzi[]
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() indirizzo: Indirizzi | null = null; // Changed from TipologieIndirizzi to Indirizzi

  constructor(private api: ApiService) {
    // Initialize the observable for address data
    this.elencoIndirizzi$ = this.api.getIndirizzi().pipe( // Changed to getIndirizzi
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoIndirizzi$ if not using async pipe in the template
    this.elencoIndirizzi$.subscribe({
      error: (err) => console.error('Error fetching addresses:', err) // Updated error message
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
      this.obsDelIndirizzo(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(indirizzo => indirizzo.idIndirizzo !== id); // Update to filter by idIndirizzo
        },
        error: (err) => console.error('Error deleting address:', err)
      });
    }
  }

  obsDelIndirizzo(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteIndirizzi(idRisorsa).pipe( // Changed to deleteIndirizzi
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}