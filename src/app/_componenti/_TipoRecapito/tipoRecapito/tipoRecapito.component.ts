import { Component } from '@angular/core';
import { TipoRecapito } from 'src/app/_type/_Admin/tipoRecapito.type'; // Changed from TipologieIndirizzi to TipoRecapito

@Component({
  selector: 'tipoRecapito', // Kept the selector unchanged
  templateUrl: './tipoRecapito.component.html', // Kept the template URL unchanged
  styleUrls: ['./tipoRecapito.component.scss'] // Kept the style URL unchanged
})
export class TipoRecapitoComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedTipologia: TipoRecapito | null = null; // Changed from TipologieIndirizzi to TipoRecapito

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleTipologiaSelected(event: { action: string, tipologia: TipoRecapito }) { // Changed from TipologieIndirizzi to TipoRecapito
    this.selectedTipologia = event.tipologia; // Store the selected address type
    this.displayComponent(event.action); // Show the appropriate component
  }
}