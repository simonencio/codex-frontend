import { Component } from '@angular/core';
import { SerieTv } from 'src/app/_type/_Admin/serieTv.type';

@Component({
  selector: 'serie-tv',
  templateUrl: './serie-tv.component.html',
  styleUrls: ['./serie-tv.component.scss']
})
export class SerieTvComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedSerie: SerieTv | null = null;

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleSerieSelected(event: { action: string, serie: SerieTv }) {
    this.selectedSerie = event.serie; // Store the selected series
    this.displayComponent(event.action); // Show the appropriate component
  }
}