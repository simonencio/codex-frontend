import { Component } from '@angular/core';
import { Profilo } from 'src/app/_type/_Admin/profilo.type'; // Changed to Profilo type

@Component({
  selector: 'profili', // Kept the selector unchanged
  templateUrl: './profili.component.html', // Kept the template URL unchanged
  styleUrls: ['./profili.component.scss'] // Kept the style URL unchanged
})
export class ProfiliComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedProfilo: Profilo | null = null; // Changed from TipologieIndirizzi to Profilo

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleProfiloSelected(event: { action: string, profilo: Profilo }) { // Changed from tipologia to profilo
    this.selectedProfilo = event.profilo; // Store the selected profile
    this.displayComponent(event.action); // Show the appropriate component
  }
}