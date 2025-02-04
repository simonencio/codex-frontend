import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Indirizzi } from 'src/app/_type/_Admin/Indirizzi.type'; // Importing Indirizzi type
import { TipologieIndirizzi } from 'src/app/_type/_Admin/tipologieIndirizzi.type';
import { Cittadinanza } from 'src/app/_type/registrazione/cittadinanze.type';
import { Nazione } from 'src/app/_type/registrazione/nazioni.type';
import { Comune } from 'src/app/_type/registrazione/comuni.type';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-aggiungi-Indirizzi', // Keeping the original selector
  templateUrl: './aggiungi-Indirizzi.component.html', // Keeping the original template URL
  styleUrls: ['./aggiungi-Indirizzi.component.scss'] // Keeping the original style URL
})
export class AggiungiIndirizziComponent implements OnInit, OnDestroy {
  elencoIndirizzi$: Observable<IRispostaServer>;
  dati: Indirizzi[] = []; // Changed from Categoria[] to Indirizzi[]
  private distruggi$ = new Subject<void>();
  tipologieIndirizzi: TipologieIndirizzi[] = [];
  nazioni: Nazione[] = []; // Adjust type as necessary
  cittadinanze: Cittadinanza[] = []; // Adjust type as necessary
  comuni: Comune[] = []; // Adjust type as necessary
  province: string[] = []; // Adjust type as necessary
  cittaList: string[] = []; // Adjust type as necessary
  capList: number[] = []; // Adjust type as necessary
  isFormVisible: boolean = true;
  registrationForm: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      idTipologiaIndirizzo: [null, Validators.required],
      idContatto: [null, Validators.required],
      nazione: ['', Validators.required],
      cittadinanza: ['', Validators.required],
      provincia: ['', Validators.required],
      citta: ['', Validators.required],
      cap: [null, Validators.required],
      indirizzo: ['', Validators.required],
      civico: [null, Validators.required],
      altro: [null]
    });

    this.elencoIndirizzi$ = this.api.getIndirizzi().pipe( // Changed to getIndirizzi
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );
  }

  ngOnInit(): void {
    // Subscribe to elencoIndirizzi$ if not using async pipe in the template
    this.elencoIndirizzi$.subscribe({
      error: (err) => console.error('Error fetching addresses:', err) // Updated error message
    });

    // Fetch dropdown data
    this.api.getTipologieIndirizzi().subscribe(tipologie => {
      this.tipologieIndirizzi = tipologie.data; // Assuming the response has a data property
    });

    this.api.getNazioni().subscribe(nazioni => {
      this.nazioni = nazioni.data; // Assuming the response has a data property
    });

    this.api.getCittadinanze().subscribe(cittadinanze => {
      this.cittadinanze = cittadinanze.data; // Assuming the response has a data property
    });

    this.api.getComuni().subscribe(comuni => {
      this.comuni = comuni.data; // Assuming this returns a list of comuni
      this.populateRegioniProvinceCittàCap();
    });
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete(); // Complete the subject to free resources
  }

  // Populate province, city, and postal code based on the comuni data
  private populateRegioniProvinceCittàCap(): void {
    this.province = [...new Set(this.comuni.map(comune => comune.provincia))]; // Unique provinces
    this.cittaList = [...new Set(this.comuni.map(comune => comune.comune))]; // Unique cities
    this.capList = [...new Set(this.comuni.map(comune => comune.capInizio))]; // Unique postal codes
  }

  // Handle changes in the selected city
  onCittaChange() {
    const selectedCitta = this.registrationForm.get('citta')?.value;

    // Find the selected comune based on the selected city
    const selectedComune = this.comuni.find(comune => comune.comune === selectedCitta);

    if (selectedComune) {
      // Check if multiCap is 1
      if (selectedComune.multiCap === 1) {
        // Fill the cap field with capSegnaposto
        this.registrationForm.get('cap')?.setValue(selectedComune.capSegnaposto);

        // Generate a list of numbers from capInizio to capFine
        const capInizio = selectedComune.capInizio;
        const capFine = selectedComune.capFine;

        // Create an array of CAPs from capInizio to capFine
        this.capList = Array.from({ length: (capFine - capInizio + 1) }, (_, i) => capInizio + i);
      } else {
        // If multiCap is not 1, just set the capInizio based on the selected city
        this.capList = [selectedComune.capInizio];
        this.registrationForm.get('cap')?.setValue(selectedComune.capInizio); // Optionally set the first CAP
      }
    } else {
      // Reset the capInizio if no city is selected
      this.capList = [];
      this.registrationForm.get('cap')?.setValue(''); // Clear the cap field
    }
  }

  // Handle changes in the selected province
  onProvinciaChange() {
    const selectedProvincia = this.registrationForm.get('provincia')?.value;
    this.cittaList = this.comuni
      .filter(comune => comune.provincia === selectedProvincia)
      .map(comune => comune.comune);
    this.cittaList = [...new Set(this.cittaList)].sort(); // Ensure unique city names and sort them
  }

  // Add a new address
  aggiungiValore() {
    console.log("AGGIUNGI VALORE");

    // Create the parameter object using the form values
    const parametro: Partial<Indirizzi> = {
      idTipologiaIndirizzo: this.registrationForm.get('idTipologiaIndirizzo')?.value,
      idContatto: this.registrationForm.get('idContatto')?.value,
      nazione: this.registrationForm.get('nazione')?.value,
      cittadinanza: this.registrationForm.get('cittadinanza')?.value,
      provincia: this.registrationForm.get('provincia')?.value,
      citta: this.registrationForm.get('citta')?.value,
      cap: this.registrationForm.get('cap')?.value,
      indirizzo: this.registrationForm.get('indirizzo')?.value,
      civico: this.registrationForm.get('civico')?.value,
      // altro: this.registrationForm.get('altro')?.value,
    };

    // Call the observable to add the new address
    this.obsAddIndirizzo(parametro).subscribe({
      next: (response) => {
        console.log('Indirizzo aggiunto:', response);
        this.dati.push(response); // Assuming response contains the added address
        // Do not reset the form to retain the current input values
        // this.resetForm(); // Commented out to keep the form values
        // Optionally, you can clear specific fields if needed
        // this.registrationForm.get('idContatto')?.setValue(null); // Example of clearing a specific field
      },
      error: (err) => console.error('Error adding address:', err)
    });
  }

  // Observable for adding a new address
  obsAddIndirizzo(dati: Partial<Indirizzi>) {
    return this.api.postIndirizzi(dati).pipe( // Changed to postIndirizzi
      takeUntil(this.distruggi$),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }

  // Method to reset the form fields (if needed)
  resetForm() {
    this.registrationForm.reset(); // Reset the entire form
    this.capList = []; // Clear the CAP list
  }
}