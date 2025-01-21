import { Component } from '@angular/core';
import { Credito } from 'src/app/_type/_Admin/crediti.type'; // Changed to Credito

@Component({
  selector: 'crediti-utente', // Kept the selector unchanged
  templateUrl: './crediti-utente.component.html', // Kept the template URL unchanged
  styleUrls: ['./crediti-utente.component.scss'] // Kept the style URL unchanged
})
export class CreditoComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedCredito: Credito | null = null; // Changed from TipoRecapito to Credito

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleCreditoSelected(event: { action: string, credito: Credito }) { // Changed from TipologieIndirizzi to Credito
    this.selectedCredito = event.credito; // Store the selected credit
    this.displayComponent(event.action); // Show the appropriate component
  }
}