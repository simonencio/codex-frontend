import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import { Film } from 'src/app/_type/_Admin/Film.type';

@Component({
  selector: 'app-aggiungi-film',
  templateUrl: './aggiungi-film.component.html',
  styleUrls: ['./aggiungi-film.component.scss']
})
export class AggiungiFilmComponent implements OnInit, OnDestroy {
  elencoFilm$: Observable<IRispostaServer>;
  dati: Film[] = [];
  private distruggi$ = new Subject<void>();
  categorie: Categoria[] = [];

  // New properties for form inputs
  newIdCategoria: number | null = null;
  newTitolo: string = '';
  newDescrizione: string = '';
  newDurata: number | null = null;
  newRegista: string = '';
  newAttori: string = '';
  newAnno: number | null = null;
  isFormVisible: boolean = true;

  // New properties for file inputs
  videoFile: File | null = null;
  locandinaFile: File | null = null;
  filmFile: File | null = null; // New property for film file

  constructor(private api: ApiService) {
    this.elencoFilm$ = this.api.getFilm().pipe(
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
    this.elencoFilm$.subscribe({
      error: (err) => console.error('Error fetching films:', err)
    });
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  // Add a new film
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<Film> = {
      idCategoria: this.newIdCategoria,
      titolo: this.newTitolo,
      descrizione: this.newDescrizione,
      durata: this.newDurata,
      regista: this.newRegista,
      attori: this.newAttori,
      anno: this.newAnno,
    };

    // First, post the film data
    this.api.postFilm(parametro).subscribe({
      next: (response) => {
        console.log('Film data saved:', response);
        const filmId = response.data.idFilm; // Assuming the response contains the new film ID

        // Create a FormData object to send files and other data
        const formData = new FormData();
        formData.append('idFilm', filmId.toString()); // Include the film ID
        formData.append('videoFile', this.videoFile as Blob);
        formData.append('locandina', this.locandinaFile as Blob);
        formData.append('film', this.filmFile as Blob); // Include the film file

        // Call the observable to upload the files
        this.api.uploadFilm(formData).subscribe({
          next: (uploadResponse) => {
            console.log('Files uploaded:', uploadResponse);
            this.dati.push(response.data); // Assuming response contains the added film
            this.resetForm(); // Reset the form fields after adding
            // location.reload();
          },
          error: (uploadError) => {
            console.error('Error uploading files:', uploadError);
          }
        });
      },
      error: (err) => {
        console.error('Error adding film:', err);
      }
    });
  }

  // Method to reset the form fields
  resetForm() {
    this.newIdCategoria = null;
    this.newTitolo = '';
    this.newDescrizione = '';
    this.newDurata = null;
    this.newRegista = '';
    this.newAttori = '';
    this.newAnno = null;
    this.videoFile = null;
    this.locandinaFile = null; // Reset locandina file
    this.filmFile = null; // Reset film file
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

  // New method to handle file input changes for film
  onFilmFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filmFile = input.files[0]; // Get the first selected file
    }
  }
}