import { Component } from '@angular/core';
import { Film } from 'src/app/_type/_Admin/Film.type'; // Changed from SerieTv to Film

@Component({
  selector: 'film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedFilm: Film | null = null; // Changed from SerieTv to Film

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleFilmSelected(event: { action: string, film: Film }) { // Changed from serie to film
    this.selectedFilm = event.film; // Store the selected film
    this.displayComponent(event.action); // Show the appropriate component
  }
}