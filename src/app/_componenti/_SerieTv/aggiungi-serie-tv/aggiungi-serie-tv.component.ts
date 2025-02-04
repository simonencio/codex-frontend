import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import { SerieTv } from 'src/app/_type/_Admin/serieTv.type';

@Component({
  selector: 'app-aggiungi-serie-tv',
  templateUrl: './aggiungi-serie-tv.component.html',
  styleUrls: ['./aggiungi-serie-tv.component.scss']
})
export class AggiungiSerieTvComponent implements OnInit, OnDestroy {
  elencoSerie$: Observable<IRispostaServer>;
  dati: SerieTv[] = [];
  private distruggi$ = new Subject<void>();
  categorie: Categoria[] = [];

  // New properties for form inputs
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

  // New properties for file inputs
  videoFile: File | null = null;
  locandinaFile: File | null = null;

  constructor(private api: ApiService) {
    this.elencoSerie$ = this.api.getSerieTv().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data;
      })
    );

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
    this.elencoSerie$.subscribe({
      error: (err) => console.error('Error fetching series:', err)
    });
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  // Add a new series
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<SerieTv> = {
      idCategoria: this.newIdCategoria,
      nome: this.newNome,
      descrizione: this.newDescrizione,
      totaleStagioni: this.newTotaleStagioni,
      NumeroEpisodi: this.newNumeroEpisodi,
      regista: this.newRegista,
      attori: this.newAttori,
      annoInizio: this.newAnnoInizio,
      annoFine: this.newAnnoFine,
    };

    // First, post the series data
    this.api.postSerieTv(parametro).subscribe({
      next: (response) => {
        console.log('Film data saved:', response);
        const serieId = response.data.idSerieTv;

        // Create a FormData object to send files and other data
        const formData = new FormData();
        formData.append('idSerieTv', serieId.toString()); // Include the series ID
        formData.append('videoFile', this.videoFile as Blob);
        formData.append('locandina', this.locandinaFile as Blob);

        // Call the observable to upload the files
        this.api.uploadSerieTv(formData).subscribe({
          next: (uploadResponse) => {
            console.log('Files uploaded:', uploadResponse);
            this.dati.push(response.data); // Assuming response contains the added series
            this.resetForm(); // Reset the form fields after adding
            location.reload(); // Reload the page to refresh the series list
          },
          error: (uploadError) => {
            console.error('Error uploading files:', uploadError);
          }
        });
      },
      error: (err) => {
        console.error('Error adding series:', err);
      }
    });
  }
  // // Observable for adding a new series
  // obsAddSerieTv(dati: Partial<SerieTv>) {
  //   return this.api.postSerieTv(dati).pipe(
  //     takeUntil(this.distruggi$),
  //     tap(x => console.log("OBS ", x)),
  //     map(x => x.data) // Assuming the response structure contains a `data` property
  //   );
  // }

  // Method to reset the form fields
  resetForm() {
    this.newIdCategoria = null;
    this.newNome = '';
    this.newDescrizione = '';
    this.newTotaleStagioni = null;
    this.newNumeroEpisodi = null;
    this.newRegista = '';
    this.newAttori = '';
    this.newAnnoInizio = null;
    this.newAnnoFine = null;
    this.videoFile = null; // Reset video file
    this.locandinaFile = null; // Reset locandina file
  }

  // Method to handle file input changes for video
  onVideoFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0]; // Get the first selected file
    }
  }

  // Method to handle file input changes for locandina
  onLocandinaFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.locandinaFile = input.files[0]; // Get the first selected file
    }
  }
}