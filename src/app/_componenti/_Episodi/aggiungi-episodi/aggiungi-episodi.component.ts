import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Episodi } from 'src/app/_type/_Admin/episodi.type';

@Component({
  selector: 'app-aggiungi-episodi',
  templateUrl: './aggiungi-episodi.component.html',
  styleUrls: ['./aggiungi-episodi.component.scss']
})
export class AggiungiEpisodioComponent implements OnInit, OnDestroy {
  elencoEpisodi$: Observable<IRispostaServer>;
  dati: Episodi[] = [];
  private distruggi$ = new Subject<void>();
  serieTv: { idSerieTv: number; nome: string }[] = [];

  // New properties for form inputs
  newIdSerieTv: number | null = null;
  newTitolo: string = '';
  newDescrizione: string = '';
  newNumeroStagione: number | null = null;
  newNumeroEpisodio: number | null = null;
  newDurata: number | null = null;
  newAnno: number | null = null;
  isFormVisible: boolean = true;

  // New property for file input
  videoFile: File | null = null; // Single video file

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

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  // Add a new episode
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<Episodi> = {
      idSerieTv: this.newIdSerieTv, // Use the selected series ID
      titolo: this.newTitolo,
      descrizione: this.newDescrizione,
      numeroStagione: this.newNumeroStagione,
      NumeroEpisodio: this.newNumeroEpisodio,
      durata: this.newDurata,
      anno: this.newAnno,
    };

    // Call the observable to add the new episode
    this.api.postEpisodi(parametro).subscribe({
      next: (response) => {
        console.log('Episodio data saved:', response);
        const episodioId = response.data.idEpisodio; // Assuming the response contains the new episode ID
        const numeroEpisodio = this.newNumeroEpisodio; // Get the NumeroEpisodio from the form

        // Check if videoFile is set
        if (!this.videoFile) {
          console.error('No video file selected.');
          return; // Exit if no file is selected
        }

        // Create a FormData object to send the video file
        // Create a FormData object to send the video file
        const formData = new FormData();
        formData.append('idEpisodio', episodioId.toString()); // Include the episode ID

        if (this.newIdSerieTv !== null) {
          formData.append('idSerieTv', this.newIdSerieTv.toString()); // Include the series ID
        } else {
          console.error('Series ID is null. Cannot proceed with the upload.');
          return; // Exit the function if the series ID is null
        }

        // Create a new Blob with the desired filename
        const newFileName = `episodio${numeroEpisodio}.mp4`;
        const renamedFile = new File([this.videoFile], newFileName, { type: this.videoFile.type });

        formData.append('videoFile', renamedFile); // Append the renamed file to FormData

        // Call the observable to upload the video file
        this.api.uploadEpisodi(formData).subscribe({
          next: (uploadResponse) => {
            console.log('File uploaded:', uploadResponse);
            this.dati.push(response.data); // Assuming response contains the added episode
            this.resetForm(); // Reset the form fields after adding
          },
          error: (uploadError) => {
            console.error('Error uploading file:', uploadError);
          }
        });
      },
      error: (err) => console.error('Error adding episode:', err)
    });
  }

  // Method to reset the form fields
  resetForm() {
    this.newIdSerieTv = null;
    this.newTitolo = '';
    this.newDescrizione = '';
    this.newNumeroStagione = null;
    this.newNumeroEpisodio = null;
    this.newDurata = null;
    this.newAnno = null;
    this.videoFile = null; // Reset video file
  }

  // Method to handle file input changes for the video file
  onVideoFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.videoFile = input.files[0]; // Get the first selected file
    }
  }
}