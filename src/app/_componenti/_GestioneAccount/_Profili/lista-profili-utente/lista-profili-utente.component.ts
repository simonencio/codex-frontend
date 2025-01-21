import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Profilo } from 'src/app/_type/_Admin/profilo.type';
import { Contatto } from 'src/app/_type/_Admin/Contatto.type';

@Component({
  selector: 'app-lista-profili-utente',
  templateUrl: './lista-profili-utente.component.html',
  styleUrls: ['./lista-profili-utente.component.scss']
})
export class ListaProfiliComponent implements OnInit {
  elencoProfili$: Observable<IRispostaServer>;
  dati: Profilo[] = [];
  contatti: Contatto[] = [];
  private distruggi$ = new Subject<void>();
  loggedInIdContatto: number | null = null; // Store the logged-in user's idContatto

  @Output() profiloSelected = new EventEmitter<{ action: string, profilo: Profilo }>();

  constructor(private api: ApiService) {
    this.elencoProfili$ = this.api.getProfilo().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
        // Sort the data by idContatto
        this.dati.sort((a, b) => a.idContatto - b.idContatto);
      })
    );

    this.api.getContatto().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.contatti = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching contatti:', err)
    });
  }

  ngOnInit(): void {
    // Retrieve the logged-in user's idContatto from session storage
    this.loggedInIdContatto = this.getLoggedInIdContatto();

    this.elencoProfili$.subscribe({
      next: () => {
        // Filter the profiles to only include those for the logged-in idContatto
        if (this.loggedInIdContatto !== null) {
          this.dati = this.dati.filter(profilo => profilo.idContatto === this.loggedInIdContatto);
        }
      },
      error: (err) => console.error('Error fetching profili:', err)
    });
  }

  editProfilo(profilo: Profilo) {
    this.profiloSelected.emit({ action: 'modifica', profilo });
  }

  deleteProfilo(id: number) {
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteProfilo(id.toString()).subscribe({
      next: () => {
        console.log("Profilo deleted:", id);
        this.dati = this.dati.filter(profilo => profilo.idProfilo !== id);
      },
      error: (err) => console.error('Error deleting profilo:', err)
    });
  }

  getContattoName(idContatto: number): string {
    const contatto = this.contatti.find(c => c.idContatto === idContatto);
    return contatto ? `${contatto.nome} ${contatto.cognome}` : 'Unknown';
  }

  // Method to retrieve the logged-in user's idContatto from session storage
  private getLoggedInIdContatto(): number | null {
    const authData = sessionStorage.getItem('auth'); // Assuming the auth data is stored under the key 'auth'
    if (authData) {
      const parsedData = JSON.parse(authData); // Parse the JSON string
      return parsedData.idContatto ? parseInt(parsedData.idContatto, 10) : null; // Convert to number
    }
    return null; // Return null if not found
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }
}