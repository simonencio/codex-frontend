import { Component } from '@angular/core';
import { TipologieIndirizzi } from 'src/app/_type/_Admin/tipologieIndirizzi.type'; // Changed from Categoria to TipologieIndirizzi

@Component({
  selector: 'tipologieIndirizzi', // Kept the selector unchanged
  templateUrl: './tipologieIndirizzi.component.html', // Kept the template URL unchanged
  styleUrls: ['./tipologieIndirizzi.component.scss'] // Kept the style URL unchanged
})
export class TipologieIndirizziComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedTipologia: TipologieIndirizzi | null = null; // Changed from Categoria to TipologieIndirizzi

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleTipologiaSelected(event: { action: string, tipologia: TipologieIndirizzi }) { // Changed from categoria to tipologia
    this.selectedTipologia = event.tipologia; // Store the selected address type
    this.displayComponent(event.action); // Show the appropriate component
  }
}