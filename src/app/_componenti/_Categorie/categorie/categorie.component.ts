import { Component } from '@angular/core';
import { Categoria } from 'src/app/_type/_Admin/categorie.type'; // Changed from Episodi to Categoria

@Component({
  selector: 'categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent {
  showAggiungi = false;
  showModifica = false;
  showCancella = false;
  selectedCategoria: Categoria | null = null; // Changed from Episodi to Categoria

  displayComponent(component: string) {
    this.showAggiungi = component === 'aggiungi';
    this.showModifica = component === 'modifica';
    this.showCancella = component === 'cancella';
  }

  handleCategoriaSelected(event: { action: string, categoria: Categoria }) { // Changed from episodio to categoria
    this.selectedCategoria = event.categoria; // Store the selected category
    this.displayComponent(event.action); // Show the appropriate component
  }
}