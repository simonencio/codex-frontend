import { Component } from '@angular/core';

@Component({
  selector: 'app-gestione-account',
  templateUrl: './gestione-account.component.html',
  styleUrls: ['./gestione-account.component.scss']
})
export class GestioneAccountComponent {
  showCrediti: boolean = false;
  showIndirizzi: boolean = false;
  showProfili: boolean = false;
  showRecapiti: boolean = false;
  toggleCrediti() {
    if (this.showCrediti) {
      this.showCrediti = false; // Hide Film if it's currently shown
    } else {
      this.showRecapiti = false;
      this.showCrediti = true;
      this.showProfili = false;
      this.showIndirizzi = false;
    }
  }
  toggleIndirizzi() {
    if (this.showIndirizzi) {
      this.showIndirizzi = false; // Hide Film if it's currently shown
    } else {
      this.showRecapiti = false;
      this.showCrediti = false;
      this.showProfili = false;
      this.showIndirizzi = true;
    }
  }

  toggleProfili() {
    if (this.showProfili) {
      this.showProfili = false; // Hide Film if it's currently shown
    } else {
      this.showCrediti = false;
      this.showProfili = true;
      this.showIndirizzi = false;
      this.showRecapiti = false;
    }
  }


  toggleRecapiti() {
    if (this.showRecapiti) {
      this.showRecapiti = false; // Hide Film if it's currently shown
    } else {
      this.showRecapiti = true;
      this.showCrediti = false;
      this.showProfili = false;
      this.showIndirizzi = false;
    }
  }
}
