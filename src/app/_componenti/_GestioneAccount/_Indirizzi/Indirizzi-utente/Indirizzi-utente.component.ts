import { Component } from '@angular/core';
import { Indirizzi } from 'src/app/_type/_Admin/Indirizzi.type'; // Changed from TipologieIndirizzi to Indirizzi

@Component({
  selector: 'Indirizzi-utente', // Kept the selector unchanged
  templateUrl: './Indirizzi-utente.component.html', // Kept the template URL unchanged
  styleUrls: ['./Indirizzi-utente.component.scss'] // Kept the style URL unchanged
})
export class IndirizziComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedIndirizzo: Indirizzi | null = null; // Changed from TipologieIndirizzi to Indirizzi

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleIndirizzoSelected(event: { action: string, indirizzo: Indirizzi }) { // Changed from tipologia to indirizzo
    this.selectedIndirizzo = event.indirizzo; // Store the selected address
    this.displayComponent(event.action); // Show the appropriate component
  }
}