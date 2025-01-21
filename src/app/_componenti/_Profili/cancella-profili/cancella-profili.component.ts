import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Profilo } from 'src/app/_type/_Admin/profilo.type'; // Changed from TipologieIndirizzi to Profilo

@Component({
  selector: 'app-cancella-profili',
  templateUrl: './cancella-profili.component.html',
  styleUrls: ['./cancella-profili.component.scss']
})
export class CancellaProfiliComponent implements OnInit, OnDestroy {

  elencoProfili$: Observable<IRispostaServer>;
  dati: Profilo[] = []; // Changed from TipologieIndirizzi[] to Profilo[]
  private distruggi$ = new Subject<void>();
  idRisorsa: number | null = null;
  idRisorsaCancella: number | null = null;
  @Input() profilo: Profilo | null = null; // Changed from TipologieIndirizzi to Profilo

  constructor(private api: ApiService) {
    // Initialize the observable for profile data
    this.elencoProfili$ = this.api.getProfilo().pipe( // Changed to getProfili
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoProfili$ if not using async pipe in the template
    this.elencoProfili$.subscribe({
      error: (err) => console.error('Error fetching profiles:', err) // Updated error message
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
      this.obsDelProfilo(id).subscribe({
        next: () => {
          console.log("Cancellato");
          this.dati = this.dati.filter(profilo => profilo.idProfilo !== id); // Update to filter by idProfilo
        },
        error: (err) => console.error('Error deleting profile:', err)
      });
    }
  }

  obsDelProfilo(id: number) {
    const idRisorsa = id + '';
    return this.api.deleteProfilo(idRisorsa).pipe( // Changed to deleteProfili
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x))
    );
  }
}