import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { Profilo } from 'src/app/_type/_Admin/profilo.type';
import { Contatto } from 'src/app/_type/_Admin/Contatto.type';

@Component({
  selector: 'app-lista-profili',
  templateUrl: './lista-profili.component.html',
  styleUrls: ['./lista-profili.component.scss']
})
export class ListaProfiliComponent implements OnInit {
  elencoProfili$: Observable<IRispostaServer>;
  dati: Profilo[] = [];
  contatti: Contatto[] = [];
  private distruggi$ = new Subject<void>();

  @Output() profiloSelected = new EventEmitter<{ action: string, profilo: Profilo }>();

  constructor(private api: ApiService) {
    this.elencoProfili$ = this.api.getProfilo().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
        // Sort the data by idContatto
        this.dati.sort((a, b) => a.idContatto - b.idContatto);
      })
    );

    this.api.getContatto().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.contatti = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching contatti:', err)
    });
  }

  ngOnInit(): void {
    this.elencoProfili$.subscribe({
      error: (err) => console.error('Error fetching profili:', err)
    });
  }

  editProfilo(profilo: Profilo) {
    this.profiloSelected.emit({ action: 'modifica', profilo });
  }

  deleteProfilo(id: number) {
    this.cancellaValore(id);
  }

  cancellaValore(id: number) {
    this.api.deleteProfilo(id.toString()).subscribe({
      next: () => {
        console.log("Profilo deleted:", id);
        this.dati = this.dati.filter(profilo => profilo.idProfilo !== id);
      },
      error: (err) => console.error('Error deleting profilo:', err)
    });
  }

  getContattoName(idContatto: number): string {
    const contatto = this.contatti.find(c => c.idContatto === idContatto);
    return contatto ? `${contatto.nome} ${contatto.cognome}` : 'Unknown';
  }
}