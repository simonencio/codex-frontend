import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import { Film } from 'src/app/_type/_Admin/Film.type'; // Assuming you have a film type defined

@Component({
  selector: 'app-modifica-film',
  templateUrl: './modifica-film.component.html',
  styleUrls: ['./modifica-film.component.scss']
})
export class ModificaFilmComponent implements OnInit, OnDestroy, OnChanges {
  elencoFilm$: Observable<IRispostaServer>;
  dati: Film[] = []; // Changed from SerieTv to Film
  categorie: Categoria[] = [];
  private distruggi$ = new Subject<void>();
  videoFile: File | null = null;
  locandinaFile: File | null = null;
  filmFile: File | null = null;

  // Form fields
  @Input() film: Film | null = null; // Changed from serie to film
  newIdCategoria: number | null = null;
  newTitolo: string = ''; // Changed from newNome to newTitolo
  newDescrizione: string = '';
  newDurata: number | null = null; // Changed from newTotaleStagioni to newDurata
  newRegista: string = '';
  newAttori: string = '';
  newAnno: number | null = null; // Changed from newAnnoInizio and newAnnoFine to newAnno
  isFormVisible: boolean = true;

  constructor(private api: ApiService) {
    // Initialize the observable for film data
    this.elencoFilm$ = this.api.getFilm().pipe( // Changed to getFilm
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
    // Subscribe to elencoFilm$ if not using async pipe in the template
    this.elencoFilm$.subscribe({
      error: (err) => console.error('Error fetching films:', err) // Updated error message
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['film'] && this.film) {
      this.populateFormFields(this.film);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  private populateFormFields(film: Film): void { // Changed from serie to film
    this.newIdCategoria = film.idCategoria;
    this.newTitolo = film.titolo; // Changed from serie.nome to film.titolo
    this.newDescrizione = film.descrizione;
    this.newDurata = film.durata; // Changed from serie.totaleStagioni to film.durata
    this.newRegista = film.regista;
    this.newAttori = film.attori;
    this.newAnno = film.anno; // Changed from serie.annoInizio and serie.annoFine to film.anno
  }

  modificaValore(
    idFilm: number,
    newIdCategoria: number | null,
    newTitolo?: string,
    newDescrizione?: string,
    newDurata?: number | null,
    newRegista?: string,
    newAttori?: string,
    newAnno?: number | null
  ) {
    console.log("MODIFICA VALORE ", idFilm, newIdCategoria, newTitolo, newDescrizione, newDurata, newRegista, newAttori, newAnno);

    if (idFilm !== null) {
      const parametro: Partial<Film> = {
        ...(newIdCategoria !== undefined ? { idCategoria: newIdCategoria } : {}),
        ...(newTitolo !== undefined ? { titolo: newTitolo } : {}),
        ...(newDescrizione !== undefined ? { descrizione: newDescrizione } : {}),
        ...(newDurata !== undefined ? { durata: newDurata } : {}),
        ...(newRegista !== undefined ? { regista: newRegista } : {}),
        ...(newAttori !== undefined ? { attori: newAttori } : {}),
        ...(newAnno !== undefined ? { anno: newAnno } : {}),
      };

      // Update film details first
      this.obsModFilm(idFilm, parametro).subscribe({
        next: (response) => {
          console.log('Film modified:', response);
          const index = this.dati.findIndex(film => film.idFilm === idFilm);
          if (index !== -1) {
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false;

          // Now upload the files
          this.uploadFiles(idFilm);
        },
        error: (err) => console.error('Error modifying film:', err)
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  private uploadFiles(idFilm: number) {
    const formData = new FormData();
    formData.append('idFilm', idFilm.toString());
    if (this.videoFile) formData.append('videoFile', this.videoFile);
    if (this.locandinaFile) formData.append('locandina', this.locandinaFile);
    if (this.filmFile) formData.append('film', this.filmFile);

    this.api.uploadFilm(formData).subscribe({
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

  // Method to handle file input changes for locandina
  onLocandinaFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.locandinaFile = input.files[0]; // Get the first selected file
    }
  }

  // Method to handle file input changes for film
  onFilmFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.filmFile = input.files[0]; // Get the first selected file
    }
  }
  // Observable for modifying an existing film
  obsModFilm(id: number, dati: Partial<Film>) { // Changed from obsModSerieTv to obsModFilm
    return this.api.putFilm(id, dati).pipe( // Changed to putFilm
      takeUntil(this.distruggi$),
      tap(x => console.log("OBS ", x)),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }
}