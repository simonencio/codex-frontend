import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Nazione } from 'src/app/_type/registrazione/nazioni.type';
import { Comune } from 'src/app/_type/registrazione/comuni.type';
import { TipologiaIndirizzo } from 'src/app/_type/registrazione/tipologiaIndirizzi.type';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-residenza',
  templateUrl: './residenza.component.html',
  styleUrls: ['./residenza.component.scss']
})
export class ResidenzaComponent implements OnInit {
  @Input() previousData: any;
  @Input() nazioni: Nazione[] = [];
  @Input() comuni: Comune[] = [];
  @Input() province: string[] = [];
  @Input() citta: string[] = [];
  @Input() capInizio: number[] = [];
  @Input() tipologiaIndirizzi: TipologiaIndirizzo[] = [];
  @Output() onBack: EventEmitter<void> = new EventEmitter();
  registrationForm: FormGroup;

  // Search functions
  searchNazione: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.nazioni
        .filter(nazione => nazione.nome.toLowerCase().indexOf(term.toLowerCase()) > -1)
        .map(nazione => nazione.nome) // Return only the names
        .slice(0, 10))
    );

  searchProvincia: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.province.filter(provincia => provincia.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchCitta: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.citta.filter(citta => citta.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registrationForm = this.fb.group({
      cittadinanza: ['italiana', Validators.required],
      nazione: ['', Validators.required],
      provincia: ['', Validators.required],
      citta: ['', Validators.required],
      cap: ['', Validators.required],
      tipologiaIndirizzo: ['', Validators.required],
      indirizzo: ['', Validators.required],
      civico: ['', Validators.required],
    });

    this.apiService.getTipologiaIndirizzo().subscribe((response: IRispostaServer) => {
      this.tipologiaIndirizzi = response.data as TipologiaIndirizzo[];
      this.populateTipologiaIndirizzi();
    });

    this.apiService.getComuni().subscribe((response: IRispostaServer) => {
      this.comuni = response.data as Comune[];
      this.populateRegioniProvinceCittàCap();
    });

    this.apiService.getNazioni().subscribe((response: IRispostaServer) => {
      this.nazioni = response.data as Nazione[];
      this.populateNazioni();
    });
  }

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
        this.capInizio = Array.from({ length: (capFine - capInizio + 1) }, (_, i) => capInizio + i);
      } else {
        // If multiCap is not 1, just set the capInizio based on the selected city
        this.capInizio = [selectedComune.capInizio];
        this.registrationForm.get('cap')?.setValue(selectedComune.capInizio); // Optionally set the first CAP
      }
    } else {
      // Reset the capInizio if no city is selected
      this.capInizio = [];
      this.registrationForm.get('cap')?.setValue(''); // Clear the cap field
    }
  }

  onProvinciaChange() {
    const selectedProvincia = this.registrationForm.get('provincia')?.value;
    this.citta = this.comuni
      .filter(comune => comune.provincia === selectedProvincia)
      .map(comune => comune.comune);
    this.citta = [...new Set(this.citta)].sort();
  }
  ngOnInit() {
    if (this.previousData) {
      this.registrationForm.patchValue(this.previousData);
    }
  }

  private populateTipologiaIndirizzi(): void {
    const uniqueNomi = [...new Set(this.tipologiaIndirizzi.map(tipologia => tipologia.nome))];
    this.tipologiaIndirizzi = uniqueNomi.map(nome => {
      return this.tipologiaIndirizzi.find(tipologia => tipologia.nome === nome) as TipologiaIndirizzo;
    }).filter(tipologia => tipologia !== undefined);
  }

  private populateNazioni(): void {
    const uniqueNomi = [...new Set(this.nazioni.map(nazione => nazione.nome))];
    this.nazioni = uniqueNomi.map(nome => {
      return this.nazioni.find(nazione => nazione.nome === nome) as Nazione;
    }).filter(nazione => nazione !== undefined);
  }

  private populateRegioniProvinceCittàCap(): void {
    this.province = [...new Set(this.comuni.map(comune => comune.provincia))];
    this.citta = [...new Set(this.comuni.map(comune => comune.comune))];
    this.capInizio = [...new Set(this.comuni.map(comune => comune.capInizio))];
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = {
        ...this.registrationForm.value,
        ...this.previousData // Combine with previous data
      };

      this.apiService.postRegistrazione(formData).subscribe(
        (response: IRispostaServer) => {
          alert(response.message || 'User  successfully registered');
          this.registrationForm.reset();
          this.onBack.emit(); // Emit the event to go back
        },
        error => {
          alert(error.error.message || 'Error registering user');
        }
      );
    }
  }
}