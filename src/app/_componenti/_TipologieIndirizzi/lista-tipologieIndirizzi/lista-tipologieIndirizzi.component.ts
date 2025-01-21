import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { TipologieIndirizzi } from 'src/app/_type/_Admin/tipologieIndirizzi.type'; // Changed from Categoria to TipologieIndirizzi

@Component({
  selector: 'app-lista-tipologieIndirizzi', // Kept the selector unchanged
  templateUrl: './lista-tipologieIndirizzi.component.html', // Kept the template URL unchanged
  styleUrls: ['./lista-tipologieIndirizzi.component.scss'] // Kept the style URL unchanged
})
export class ListaTipologieIndirizziComponent implements OnInit {
  elencoTipologie$: Observable<IRispostaServer>;
  dati: TipologieIndirizzi[] = []; // Changed from Categoria[] to TipologieIndirizzi[]
  private distruggi$ = new Subject<void>();

  // Output event emitter to notify parent component
  @Output() tipologiaSelected = new EventEmitter<{ action: string, tipologia: TipologieIndirizzi }>(); // Changed from categoria to tipologia

  constructor(private api: ApiService) {
    this.elencoTipologie$ = this.api.getTipologieIndirizzi().pipe( // Changed to getTipologieIndirizzi
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

  editTipologia(tipologia: TipologieIndirizzi) { // Changed from editCategoria to editTipologia
    // Emit the selected address type for modification
    this.tipologiaSelected.emit({ action: 'modifica', tipologia }); // Changed from categoria to tipologia
  }

  deleteTipologia(id: number) { // Changed from deleteCategoria to deleteTipologia
    // Call the delete method directly
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteTipologieIndirizzi(id.toString()).subscribe({ // Changed to deleteTipologieIndirizzi
      next: () => {
        console.log("Tipologia Indirizzo deleted:", id); // Updated log message
        // Remove the deleted address type from the local data array
        this.dati = this.dati.filter(tipologia => tipologia.idTipologiaIndirizzo !== id); // Changed from idCategoria to idTipologiaIndirizzo
      },
      error: (err) => console.error('Error deleting address type:', err) // Updated error message
    });
  }
}