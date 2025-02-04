import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Indirizzi } from 'src/app/_type/_Admin/Indirizzi.type';
import { TipologieIndirizzi } from 'src/app/_type/_Admin/tipologieIndirizzi.type';
import { Cittadinanza } from 'src/app/_type/registrazione/cittadinanze.type';
import { Nazione } from 'src/app/_type/registrazione/nazioni.type';
import { Comune } from 'src/app/_type/registrazione/comuni.type';

@Component({
  selector: 'app-modifica-Indirizzi-utente',
  templateUrl: './modifica-Indirizzi-utente.component.html',
  styleUrls: ['./modifica-Indirizzi-utente.component.scss']
})
export class ModificaIndirizziComponent implements OnInit, OnDestroy {
  elencoIndirizzi$: Observable<IRispostaServer> | null = null;;
  dati: Indirizzi[] = [];
  private distruggi$ = new Subject<void>();
  isFormVisible: boolean = true;
  registrationForm: FormGroup;
  tipologieIndirizzi: TipologieIndirizzi[] = [];
  nazioni: Nazione[] = [];
  cittadinanze: Cittadinanza[] = [];
  province: string[] = [];
  comuni: Comune[] = [];
  cittaList: string[] = [];
  capList: number[] = [];

  @Input() indirizzo: Indirizzi | null = null;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      idIndirizzo: [null, Validators.required],
      idTipologiaIndirizzo: [null, Validators.required],
      idContatto: [null, Validators.required],
      nazione: ['', Validators.required],
      cittadinanza: ['', Validators.required],
      provincia: ['', Validators.required],
      citta: ['', Validators.required],
      cap: [null, [Validators.required, Validators.min(0)]],
      indirizzo: ['', Validators.required],
      civico: [null, [Validators.required, Validators.min(1)]],
      altro: ['']
    });
  }

  ngOnInit(): void {
    this.elencoIndirizzi$ = this.api.getIndirizzi().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.dati = response.data; // Assuming response has a data property
      })
    );

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

    if (this.indirizzo) {
      this.populateFormFields(this.indirizzo);
    }
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
    this.distruggi$.complete();
  }

  private populateFormFields(indirizzo: Indirizzi): void {
    this.registrationForm.patchValue({
      idIndirizzo: indirizzo.idIndirizzo,
      idTipologiaIndirizzo: indirizzo.idTipologiaIndirizzo,
      idContatto: indirizzo.idContatto,
      nazione: indirizzo.nazione,
      cittadinanza: indirizzo.cittadinanza,
      provincia: indirizzo.provincia,
      citta: indirizzo.citta,
      cap: indirizzo.cap,
      indirizzo: indirizzo.indirizzo,
      civico: indirizzo.civico,
      altro: indirizzo.altro
    });
  }

  modificaValore() {
    console.log("MODIFICA VALORE");

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
      altro: this.registrationForm.get('altro')?.value || 'null',
    };

    const idIndirizzo = this.registrationForm.get('idIndirizzo')?.value;

    if (idIndirizzo !== null) {
      this.obsModIndirizzo(idIndirizzo, parametro).subscribe({
        next: (response) => {
          console.log('Indirizzo modified:', response);
          const index = this.dati.findIndex(indirizzo => indirizzo.idIndirizzo === idIndirizzo);
          if (index !== -1) {
            this.dati[index] = { ...this.dati[index], ...parametro };
          }
          this.isFormVisible = false; // Hide the form after modification
          location.reload(); // Reload the page to refresh the address list
        },
        error: (err) => console.error('Error modifying address:', err)
      });
    } else {
      console.error('Invalid ID for modification');
    }
  }

  // Observable for modifying an existing address
  obsModIndirizzo(id: number, dati: Partial<Indirizzi>) {
    return this.api.putIndirizzi(id, dati).pipe(
      takeUntil(this.distruggi$),
      map(x => x.data) // Assuming the response structure contains a `data` property
    );
  }

  // Populate province, city, and postal code based on the comuni data
  private populateRegioniProvinceCittàCap(): void {
    this.province = [...new Set(this.comuni.map(comune => comune.provincia))]; // Unique provinces
    this.cittaList = [...new Set(this.comuni.map(comune => comune.comune))]; // Unique cities
    this.capList = [...new Set(this.comuni.map(comune => comune.capInizio))]; // Unique postal codes
  }

  // Handle changes in the selected province
  onProvinciaChange() {
    const selectedProvincia = this.registrationForm.get('provincia')?.value;
    this.cittaList = this.comuni
      .filter(comune => comune.provincia === selectedProvincia)
      .map(comune => comune.comune);
    this.cittaList = [...new Set(this.cittaList)].sort(); // Ensure unique city names and sort them
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
}