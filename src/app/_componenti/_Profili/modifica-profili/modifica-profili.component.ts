import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Profilo } from 'src/app/_type/_Admin/profilo.type'; // Changed to Profilo type

@Component({
  selector: 'app-modifica-profili', // Kept the selector unchanged
  templateUrl: './modifica-profili.component.html', // Kept the template URL unchanged
  styleUrls: ['./modifica-profili.component.scss'] // Kept the style URL unchanged
})
export class ModificaProfiliComponent implements OnInit, OnDestroy, OnChanges {
  elencoProfili$: Observable<IRispostaServer>;
  dati: Profilo[] = []; // Changed from TipologieIndirizzi[] to Profilo[]
  private distruggi$ = new Subject<void>();

  // Form fields
  @Input() profilo: Profilo | null = null; // Changed from tipologia to profilo
  newNome: string = ''; // Kept as newNome
  isFormVisible: boolean = true;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profilo'] && this.profilo) {
      this.populateFormFields(this.profilo);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  private populateFormFields(profilo: Profilo): void { // Changed from tipologia to profilo
    this.newNome = profilo.nome; // Changed from tipologia.nome to profilo.nome
  }

  modificaValore(
    idProfilo: number,
    newNome?: string
  ) {
    console.log("MODIFICA VALORE ", idProfilo, newNome);

    if (idProfilo !== null) {
      const parametro: Partial<Profilo> = { // Changed from TipologieIndirizzi to Profilo
        ...(newNome !== undefined ? { nome: newNome } : {}),
      };

      this.obsModProfilo(idProfilo, parametro).subscribe({
        next: (response) => {
          console.log('Profilo modified:', response);
          // Update the local data accordingly
          const index = this.dati.findIndex(profilo => profilo.idProfilo === idProfilo); // Changed from idTipologiaIndirizzo to idProfilo
          if (index !== -1) {
            // Update the local data with the new values
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false; // Hide the form after modification
        },
        error: (err) => console.error('Error modifying profile:', err) // Updated error message
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  // Observable for modifying an existing profile
  obsModProfilo(id: number, dati: Partial<Profilo>) { // Changed from obsModTipologia to obsModProfilo
    return this.api.putProfilo(id, dati).pipe( // Changed to putProfilo
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }
}