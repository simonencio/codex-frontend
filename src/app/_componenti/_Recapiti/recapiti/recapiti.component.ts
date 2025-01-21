import { Component } from '@angular/core';
import { Recapito } from 'src/app/_type/_Admin/recapiti.type'; // Importing Recapito type

@Component({
  selector: 'recapiti', // Kept the selector unchanged
  templateUrl: './recapiti.component.html', // Kept the template URL unchanged
  styleUrls: ['./recapiti.component.scss'] // Kept the style URL unchanged
})
export class RecapitiComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedRecapito: Recapito | null = null; // Changed from TipoRecapito to Recapito

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleRecapitoSelected(event: { action: string, recapito: Recapito }) { // Changed from TipologieIndirizzi to Recapito
    this.selectedRecapito = event.recapito; // Store the selected recapito
    this.displayComponent(event.action); // Show the appropriate component
  }
}