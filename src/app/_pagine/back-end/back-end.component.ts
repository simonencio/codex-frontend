import { Component } from '@angular/core';

@Component({
  selector: 'back-end',
  templateUrl: './back-end.component.html',
  styleUrls: ['./back-end.component.scss']
})
export class BackEndComponent {
  showSerieTv: boolean = false; // Flag to control visibility of Serie TV
  showFilm: boolean = false; // Flag to control visibility of Film
  showEpisodi: boolean = false;
  showCategorie: boolean = false;
  showTipologieIndirizzi: boolean = false;
  showIndirizzi: boolean = false;
  showProfili: boolean = false;
  showTipiRecapiti: boolean = false;
  showCrediti: boolean = false;
  showRecapiti: boolean = false;
  // Method to toggle the visibility of the SerieTv component
  toggleSerieTv() {
    if (this.showSerieTv) {
      this.showSerieTv = false; // Hide Serie TV if it's currently shown
    } else {
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showEpisodi = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = true; // Hide Serie TV if showing Film
    }
  }

  // Method to toggle the visibility of the Film component
  toggleFilm() {
    if (this.showFilm) {
      this.showFilm = false; // Hide Film if it's currently shown
    } else {
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showEpisodi = false;
      this.showFilm = true; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }

  toggleEpisodi() {
    if (this.showEpisodi) {
      this.showEpisodi = false; // Hide Film if it's currently shown
    } else {
      this.showEpisodi = true;
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }

  toggleCategorie() {
    if (this.showCategorie) {
      this.showCategorie = false; // Hide Film if it's currently shown
    } else {
      this.showEpisodi = false;
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = true;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }
  toggleTipologieIndirizzi() {
    if (this.showTipologieIndirizzi) {
      this.showTipologieIndirizzi = false; // Hide Film if it's currently shown
    } else {
      this.showEpisodi = false;
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = true;
      this.showCategorie = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }
  toggleIndirizzi() {
    if (this.showIndirizzi) {
      this.showIndirizzi = false; // Hide Film if it's currently shown
    } else {
      this.showEpisodi = false;
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = true;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }
  toggleProfili() {
    if (this.showProfili) {
      this.showProfili = false; // Hide Film if it's currently shown
    } else {
      this.showEpisodi = false;
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = true;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }
  toggleTipiRecapiti() {
    if (this.showTipiRecapiti) {
      this.showTipiRecapiti = false; // Hide Film if it's currently shown
    } else {
      this.showEpisodi = false;
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showTipiRecapiti = true;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }
  toggleCrediti() {
    if (this.showCrediti) {
      this.showCrediti = false; // Hide Film if it's currently shown
    } else {
      this.showEpisodi = false;
      this.showRecapiti = false;
      this.showCrediti = true;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }
  toggleRecapiti() {
    if (this.showRecapiti) {
      this.showRecapiti = false; // Hide Film if it's currently shown
    } else {
      this.showRecapiti = true;
      this.showCrediti = false;
      this.showTipiRecapiti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
      this.showTipologieIndirizzi = false;
      this.showCategorie = false;
      this.showEpisodi = false;
      this.showFilm = false; // Show Film
      this.showSerieTv = false; // Hide Serie TV if showing Film
    }
  }
}

