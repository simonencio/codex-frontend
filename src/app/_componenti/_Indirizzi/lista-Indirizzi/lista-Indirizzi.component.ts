import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Indirizzi } from 'src/app/_type/_Admin/Indirizzi.type'; // Import Indirizzi type
import { TipologiaIndirizzo } from 'src/app/_type/registrazione/tipologiaIndirizzi.type'; // Import TipologiaIndirizzo type
import { Contatto } from 'src/app/_type/_Admin/Contatto.type'; // Import Contatto type

@Component({
  selector: 'app-lista-Indirizzi',
  templateUrl: './lista-Indirizzi.component.html',
  styleUrls: ['./lista-Indirizzi.component.scss']
})
export class ListaIndirizziComponent implements OnInit {
  elencoIndirizzi$: Observable<IRispostaServer>;
  dati: Indirizzi[] = [];
  private distruggi$ = new Subject<void>();
  tipologieIndirizzi: TipologiaIndirizzo[] = []; // Array to hold tipologiaIndirizzi
  contatti: Contatto[] = []; // Array to hold contatti data
  @Output() indirizzoSelected = new EventEmitter<{ action: string, indirizzo: Indirizzi }>();

  constructor(private api: ApiService) {
    this.elencoIndirizzi$ = this.api.getIndirizzi().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
        // Sort the data by idContatto
        this.dati.sort((a, b) => a.idContatto - b.idContatto);
      })
    );
  }

  ngOnInit(): void {
    this.elencoIndirizzi$.subscribe({
      error: (err) => console.error('Error fetching addresses:', err)
    });
    this.api.getTipologieIndirizzi().subscribe(tipologie => {
      this.tipologieIndirizzi = tipologie.data; // Assuming the response has a data property
    });
    this.api.getContatto().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.contatti = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching contatti:', err)
    });
  }

  getTipologiaNome(idTipologiaIndirizzo: number): string {
    const tipologia = this.tipologieIndirizzi.find(t => t.idTipologiaIndirizzo === idTipologiaIndirizzo);
    return tipologia ? tipologia.nome : 'Unknown';
  }

  getContattoName(idContatto: number): string {
    const contatto = this.contatti.find(c => c.idContatto === idContatto);
    return contatto ? `${contatto.nome} ${contatto.cognome}` : 'Unknown';
  }

  editIndirizzo(indirizzo: Indirizzi) {
    this.indirizzoSelected.emit({ action: 'modifica', indirizzo });
  }

  deleteIndirizzo(id: number) {
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteIndirizzi(id.toString()).subscribe({
      next: () => {
        console.log("Indirizzo deleted:", id);
        this.dati = this.dati.filter(indirizzo => indirizzo.idIndirizzo !== id);
      },
      error: (err) => console.error('Error deleting address:', err)
    });
  }
}