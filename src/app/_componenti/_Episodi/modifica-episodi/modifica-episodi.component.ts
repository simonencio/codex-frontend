import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import { Episodi } from 'src/app/_type/_Admin/episodi.type';

@Component({
  selector: 'app-modifica-episodi',
  templateUrl: './modifica-episodi.component.html',
  styleUrls: ['./modifica-episodi.component.scss']
})
export class ModificaEpisodiComponent implements OnInit, OnDestroy, OnChanges {
  elencoEpisodi$: Observable<IRispostaServer>;
  dati: Episodi[] = [];
  private distruggi$ = new Subject<void>();
  serieTv: { idSerieTv: number; nome: string }[] = [];

  @Input() episodio: Episodi | null = null;
  newIdSerieTv: number | null = null;
  newTitolo: string = '';
  newDescrizione: string = '';
  newNumeroStagione: number | null = null;
  newNumeroEpisodio: number | null = null;
  newDurata: number | null = null;
  newAnno: number | null = null;
  isFormVisible: boolean = true;
  videoFile: File | null = null; // For the new video file

  constructor(private api: ApiService) {
    this.elencoEpisodi$ = this.api.getEpisodi().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data;
      })
    );

    this.api.getSerieTv().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.serieTv = response.data;
      })
    ).subscribe({
      error: (err) => console.error('Error fetching TV series:', err)
    });
  }

  ngOnInit(): void {
    this.elencoEpisodi$.subscribe({
      error: (err) => console.error('Error fetching episodes:', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['episodio'] && this.episodio) {
      this.populateFormFields(this.episodio);
    }
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  private populateFormFields(episodio: Episodi): void {
    this.newIdSerieTv = episodio.idSerieTv;
    this.newTitolo = episodio.titolo;
    this.newDescrizione = episodio.descrizione;
    this.newNumeroStagione = episodio.numeroStagione;
    this.newNumeroEpisodio = episodio.NumeroEpisodio;
    this.newDurata = episodio.durata;
    this.newAnno = episodio.anno;
  }

  modificaValore(
    idEpisodio: number,
    newIdSerieTv: number | null,
    newTitolo?: string,
    newDescrizione?: string,
    newNumeroStagione?: number | null,
    newNumeroEpisodio?: number | null,
    newDurata?: number | null,
    newAnno?: number | null
  ) {
    // Check if episodio is null
    if (!this.episodio) {
      console.error('No episode selected for modification.');
      return; // Exit the function if no episode is selected
    }

    console.log("MODIFICA VALORE ", idEpisodio, newIdSerieTv, newTitolo, newDescrizione, newNumeroStagione, newNumeroEpisodio, newDurata, newAnno);

    if (idEpisodio !== null) {
      const parametro: Partial<Episodi> = {
        ...(newIdSerieTv !== undefined ? { idSerieTv: newIdSerieTv } : {}),
        ...(newTitolo !== undefined ? { titolo: newTitolo } : {}),
        ...(newDescrizione !== undefined ? { descrizione: newDescrizione } : {}),
        ...(newNumeroStagione !== undefined ? { numeroStagione: newNumeroStagione } : {}),
        ...(newNumeroEpisodio !== undefined ? { NumeroEpisodio: newNumeroEpisodio } : {}),
        ...(newDurata !== undefined ? { durata: newDurata } : {}),
        ...(newAnno !== undefined ? { anno: newAnno } : {}),
      };

      // Update episode details first
      this.obsModEpisodio(idEpisodio, parametro).subscribe({
        next: (response) => {
          console.log('Episodio modified:', response);
          const index = this.dati.findIndex(episodio => episodio.idEpisodio === idEpisodio);
          if (index !== -1) {
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false;

          // Now upload the new video file if provided
          if (this.videoFile) {
            this.uploadFile(idEpisodio);
          }
        },
        error: (err) => console.error('Error modifying episode:', err)
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  private uploadFile(idEpisodio: number) {
    // Check if videoFile is null before proceeding
    if (!this.videoFile) {
      console.error('No video file selected for upload.');
      return; // Exit the function if no file is selected
    }

    const formData = new FormData();
    formData.append('idEpisodio', idEpisodio.toString());
    formData.append('idSerieTv', this.newIdSerieTv?.toString() || ''); // Include the Series ID

    // Construct the new file name
    const newFileName = `episodio${this.newNumeroEpisodio}.mp4`;
    const renamedFile = new File([this.videoFile], newFileName, { type: this.videoFile.type });

    formData.append('videoFile', renamedFile);

    this.api.uploadEpisodi(formData).subscribe({
      next: (uploadResponse) => {
        console.log('File uploaded:', uploadResponse);
      },
      error: (uploadError) => {
        console.error('Error uploading file:', uploadError);
      }
    });
  }

  obsModEpisodio(id: number, dati: Partial<Episodi>) {
    return this.api.putEpisodi(id, dati).pipe(
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data)
    );
  }

  // Method to handle file input changes for the video file
  onVideoFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0]; // Get the first selected file
    }
  }
}