import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { SerieTv } from 'src/app/_type/_Admin/serieTv.type';

@Component({
  selector: 'app-lista-serie-tv',
  templateUrl: './lista-serie-tv.component.html',
  styleUrls: ['./lista-serie-tv.component.scss']
})
export class ListaSerieTvComponent implements OnInit {
  elencoSerie$: Observable<IRispostaServer>;
  dati: SerieTv[] = [];
  private distruggi$ = new Subject<void>();

  // Output event emitter to notify parent component
  @Output() serieSelected = new EventEmitter<{ action: string, serie: SerieTv }>();

  constructor(private api: ApiService) {
    this.elencoSerie$ = this.api.getSerieTv().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data;
      })
    );
  }

  ngOnInit(): void {
    this.elencoSerie$.subscribe({
      error: (err) => console.error('Error fetching series:', err)
    });
  }

  editSerie(serie: SerieTv) {
    // Emit the selected series for modification
    this.serieSelected.emit({ action: 'modifica', serie });
  }

  deleteSerie(id: number) {
    // Call the delete method directly
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteSerieTv(id.toString()).subscribe({
      next: () => {
        console.log("Serie TV deleted:", id);
        // Remove the deleted series from the local data array
        this.dati = this.dati.filter(serie => serie.idSerieTv !== id);
      },
      error: (err) => console.error('Error deleting series:', err)
    });
  }
}