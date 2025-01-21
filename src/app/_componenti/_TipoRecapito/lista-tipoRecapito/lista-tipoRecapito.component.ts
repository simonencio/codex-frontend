import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Changed to TipoRecapito

@Component({
  selector: 'app-lista-tipoRecapito', // Kept the selector unchanged
  templateUrl: './lista-tipoRecapito.component.html', // Kept the template URL unchanged
  styleUrls: ['./lista-tipoRecapito.component.scss'] // Kept the style URL unchanged
})
export class ListaTipoRecapitoComponent implements OnInit {
  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipoRecapito[] = []; // Changed from [] to TipoRecapito[]
  private distruggi$ = new Subject<void>();

  // Output event emitter to notify parent component
  @Output() tipologiaSelected = new EventEmitter<{ action: string, tipologia: TipoRecapito }>(); // Changed from  to TipoRecapito

  constructor(private api: ApiService) {
    this.elencoTipologie$ = this.api.getTipoRecapito().pipe( // Assuming this method returns TipoRecapito[]
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    this.elencoTipologie$.subscribe({
      error: (err) => console.error('Error fetching address types:', err) // Updated error message
    });
  }

  editTipologia(tipologia: TipoRecapito) { // Changed from  to TipoRecapito
    // Emit the selected address type for modification
    this.tipologiaSelected.emit({ action: 'modifica', tipologia }); // Changed from  to TipoRecapito
  }

  deleteTipologia(id: number) { // Changed from deleteCategoria to deleteTipologia
    // Call the delete method directly
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteTipoRecapito(id.toString()).subscribe({ // Assuming this method is still valid
      next: () => {
        console.log("Tipo Recapito deleted:", id); // Updated log message
        // Remove the deleted address type from the local data array
        this.dati = this.dati.filter(tipologia => tipologia.idTipoRecapito !== id); // Changed from idTipologiaIndirizzo to idTipoRecapito
      },
      error: (err) => console.error('Error deleting address type:', err) // Updated error message
    });
  }
}