import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Episodi } from 'src/app/_type/_Admin/episodi.type'; // Changed from Film to Episodi

@Component({
  selector: 'app-lista-episodi',
  templateUrl: './lista-episodi.component.html',
  styleUrls: ['./lista-episodi.component.scss']
})
export class ListaEpisodiComponent implements OnInit {
  elencoEpisodi$: Observable<IRispostaServer>;
  dati: Episodi[] = []; // Changed from Film[] to Episodi[]
  private distruggi$ = new Subject<void>();

  // Output event emitter to notify parent component
  @Output() episodioSelected = new EventEmitter<{ action: string, episodio: Episodi }>(); // Changed from film to episodio

  constructor(private api: ApiService) {
    this.elencoEpisodi$ = this.api.getEpisodi().pipe( // Changed to getEpisodi
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    this.elencoEpisodi$.subscribe({
      error: (err) => console.error('Error fetching episodes:', err) // Updated error message
    });
  }

  editEpisodio(episodio: Episodi) { // Changed from editFilm to editEpisodio
    // Emit the selected episode for modification
    this.episodioSelected.emit({ action: 'modifica', episodio }); // Changed from film to episodio
  }

  deleteEpisodio(id: number) { // Changed from deleteFilm to deleteEpisodio
    // Call the delete method directly
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteEpisodi(id.toString()).subscribe({ // Changed to deleteEpisodio
      next: () => {
        console.log("Episodio deleted:", id); // Updated log message
        // Remove the deleted episode from the local data array
        this.dati = this.dati.filter(episodio => episodio.idEpisodio !== id); // Changed from idFilm tois
      },
      error: (err) => console.error('Error deleting episode:', err) // Updated error message
    });
  }
}