import { Component } from '@angular/core';
import { Episodi } from 'src/app/_type/_Admin/episodi.type'; // Changed from Film to Episodi

@Component({
  selector: 'episodi',
  templateUrl: './episodi.component.html',
  styleUrls: ['./episodi.component.scss']
})
export class EpisodiComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedEpisodio: Episodi | null = null; // Changed from Film to Episodi

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleEpisodioSelected(event: { action: string, episodio: Episodi }) { // Changed from film to episodio
    this.selectedEpisodio = event.episodio; // Store the selected episode
    this.displayComponent(event.action); // Show the appropriate component
  }
}