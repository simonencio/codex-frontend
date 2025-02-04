import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import { SerieTv } from 'src/app/_type/_Admin/serieTv.type';

@Component({
  selector: 'app-modifica-serie-tv',
  templateUrl: './modifica-serie-tv.component.html',
  styleUrls: ['./modifica-serie-tv.component.scss']
})
export class ModificaSerieTvComponent implements OnInit, OnDestroy, OnChanges {
  elencoSerie$: Observable<IRispostaServer>;
  dati: SerieTv[] = [];
  categorie: Categoria[] = [];
  private distruggi$ = new Subject<void>();

  // Form fields
  @Input() serie: SerieTv | null = null;
  newIdCategoria: number | null = null;
  newNome: string = '';
  newDescrizione: string = '';
  newTotaleStagioni: number | null = null;
  newNumeroEpisodi: number | null = null;
  newRegista: string = '';
  newAttori: string = '';
  newAnnoInizio: number | null = null;
  newAnnoFine: number | null = null;
  isFormVisible: boolean = true;

  // File properties
  locandinaFile: File | null = null;
  videoFile: File | null = null;

  constructor(private api: ApiService) {
    // Initialize the observable for series data
    this.elencoSerie$ = this.api.getSerieTv().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );

    // Fetch categories
    this.api.getCategorie().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.categorie = response.data; // Assuming response has a data property
      })
    ).subscribe({
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  ngOnInit(): void {
    // Subscribe to elencoSerie$ if not using async pipe in the template
    this.elencoSerie$.subscribe({
      error: (err) => console.error('Error fetching series:', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['serie'] && this.serie) {
      this.populateFormFields(this.serie);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  private populateFormFields(serie: SerieTv): void {
    this.newIdCategoria = serie.idCategoria;
    this.newNome = serie.nome;
    this.newDescrizione = serie.descrizione;
    this.newTotaleStagioni = serie.totaleStagioni;
    this.newNumeroEpisodi = serie.NumeroEpisodi;
    this.newRegista = serie.regista;
    this.newAttori = serie.attori;
    this.newAnnoInizio = serie.annoInizio;
    this.newAnnoFine = serie.annoFine;
  }

  modificaValore(
    idSerieTv: number,
    newIdCategoria: number | null,
    newNome?: string,
    newDescrizione?: string,
    newTotaleStagioni?: number | null,
    newNumeroEpisodi?: number | null,
    newRegista?: string,
    newAttori?: string,
    newAnnoInizio?: number | null,
    newAnnoFine?: number | null
  ) {
    console.log("MODIFICA VALORE ", idSerieTv, newIdCategoria, newNome, newDescrizione, newTotaleStagioni, newNumeroEpisodi, newRegista, newAttori, newAnnoInizio, newAnnoFine);

    if (idSerieTv !== null) {
      const parametro: Partial<SerieTv> = {
        ...(newIdCategoria !== undefined ? { idCategoria: newIdCategoria } : {}),
        ...(newNome !== undefined ? { nome: newNome } : {}),
        ...(newDescrizione !== undefined ? { descrizione: newDescrizione } : {}),
        ...(newTotaleStagioni !== undefined ? { totaleStagioni: newTotaleStagioni } : {}),
        ...(newNumeroEpisodi !== undefined ? { NumeroEpisodi: newNumeroEpisodi } : {}),
        ...(newRegista !== undefined ? { regista: newRegista } : {}),
        ...(newAttori !== undefined ? { attori: newAttori } : {}),
        ...(newAnnoInizio !== undefined ? { annoInizio: newAnnoInizio } : {}),
        ...(newAnnoFine !== undefined ? { annoFine: newAnnoFine } : {}),
      };

      // Update series details first
      this.obsModSerieTv(idSerieTv, parametro).subscribe({
        next: (response) => {
          console.log('Serie modified:', response);
          const index = this.dati.findIndex(serie => serie.idSerieTv === idSerieTv);
          if (index !== -1) {
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false;

          // Now upload the files
          this.uploadFiles(idSerieTv);
        },
        error: (err) => console.error('Error modifying series:', err)
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  private uploadFiles(idSerieTv: number) {
    const formData = new FormData();
    formData.append('idSerieTv', idSerieTv.toString());
    if (this.videoFile) formData.append('videoFile', this.videoFile);
    if (this.locandinaFile) formData.append('locandina', this.locandinaFile);

    this.api.uploadSerieTv(formData).subscribe({
      next: (uploadResponse) => {
        console.log('Files uploaded:', uploadResponse);
      },
      error: (uploadError) => {
        console.error('Error uploading files:', uploadError);
      }
    });
  }

  onVideoFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0]; // Get the first selected file
    }
  }

  onLocandinaFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.locandinaFile = input.files[0]; // Get the first selected file
    }
  }

  // Observable for modifying an existing series
  obsModSerieTv(id: number, dati: Partial<SerieTv>) {
    return this.api.putSerieTv(id, dati).pipe(
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }
}