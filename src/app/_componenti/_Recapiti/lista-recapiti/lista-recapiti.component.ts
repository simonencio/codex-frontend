import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Recapito } from 'src/app/_type/_Admin/recapiti.type'; // Import Recapito type
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Import TipoRecapito type
import { Contatto } from 'src/app/_type/_Admin/Contatto.type'; // Import Contatto type

@Component({
  selector: 'app-lista-recapiti',
  templateUrl: './lista-recapiti.component.html',
  styleUrls: ['./lista-recapiti.component.scss']
})
export class ListaRecapitiComponent implements OnInit {
  elencoRecapiti$: Observable<IRispostaServer>;
  dati: Recapito[] = [];
  tipologie: TipoRecapito[] = [];
  contatti: Contatto[] = []; // Array to hold contatti data
  private distruggi$ = new Subject<void>();

  @Output() recapitoSelected = new EventEmitter<{ action: string, recapito: Recapito }>();

  constructor(private api: ApiService) {
    this.elencoRecapiti$ = this.api.getRecapiti().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
        // Sort the data by idContatto
        this.dati.sort((a, b) => a.idContatto - b.idContatto);
      })
    );

    this.api.getTipoRecapito().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.tipologie = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching tipo recapito:', err)
    });

    // Fetch contatti data
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
    this.elencoRecapiti$.subscribe({
      error: (err) => console.error('Error fetching recapiti:', err)
    });
  }

  editRecapito(recapito: Recapito) {
    this.recapitoSelected.emit({ action: 'modifica', recapito });
  }

  deleteRecapito(id: number) {
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteRecapiti(id.toString()).subscribe({
      next: () => {
        console.log("Recapito deleted:", id);
        this.dati = this.dati.filter(recapito => recapito.idRecapito !== id);
      },
      error: (err) => console.error('Error deleting recapito:', err)
    });
  }

  getTipoRecapitoName(idTipoRecapito: number | null): string {
    const tipo = this.tipologie.find(t => t.idTipoRecapito === idTipoRecapito);
    return tipo ? tipo.nome : 'Unknown';
  }

  getContattoName(idContatto: number): string {
    const contatto = this.contatti.find(c => c.idContatto === idContatto);
    return contatto ? `${contatto.nome} ${contatto.cognome}` : 'Unknown';
  }
}