import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { Comune } from 'src/app/_type/registrazione/comuni.type';
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from 'rxjs';

@Component({
  selector: 'app-anagrafica',
  templateUrl: './anagrafica.component.html',
  styleUrls: ['./anagrafica.component.scss']
})
export class AnagraficaComponent implements OnInit {
  @Input() previousData: any;
  @Input() cittaNascita: string[] = [];
  @Input() comuni: Comune[] = [];
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  anagraficaForm: FormGroup;
  Cod_Catastale: string[] = [];
  tipologie: any[] = []; // Assuming you have a type for tipologie

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.anagraficaForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      sesso: ['', Validators.required],
      codiceFiscale: [{ value: '', disabled: false }, Validators.required],
      ruolo: ['Utente', Validators.required],
      dataNascita: ['', Validators.required],
      cittaNascita: ['', Validators.required],
      recapito: ['', Validators.required], // New field for Recapito
      idTipoRecapito: ['', Validators.required], // New field for Tipo Recapito
    });

    this.apiService.getComuni().subscribe((response: IRispostaServer) => {
      this.comuni = response.data as Comune[];
      this.populateRegioniProvinceCittàCap();
    });

    // Assuming you have a method to fetch tipologie
    this.apiService.getTipoRecapito().subscribe((response: IRispostaServer) => {
      this.tipologie = response.data; // Assuming response has a data property
    });
  }

  ngOnInit() {
    if (this.previousData) {
      this.anagraficaForm.patchValue(this.previousData);
    }

    // Subscribe to changes in relevant fields
    this.anagraficaForm.get('nome')?.valueChanges.subscribe(() => this.updateCodiceFiscale());
    this.anagraficaForm.get('cognome')?.valueChanges.subscribe(() => this.updateCodiceFiscale());
    this.anagraficaForm.get('sesso')?.valueChanges.subscribe(() => this.updateCodiceFiscale());
    this.anagraficaForm.get('dataNascita')?.valueChanges.subscribe(() => this.updateCodiceFiscale());
    this.anagraficaForm.get('cittaNascita')?.valueChanges.subscribe(() => this.updateCodiceFiscale());
  }

  private updateCodiceFiscale() {
    const formData = this.anagraficaForm.value;

    if (formData.nome && formData.cognome && formData.sesso && formData.dataNascita && formData.cittaNascita) {
      const selectedComune = this.comuni.find(comune => comune.comune === formData.cittaNascita);
      const codCatastale = selectedComune ? selectedComune.Cod_Catastale : '';

      const codiceFiscale = this.calculateCodiceFiscale(
        formData.nome,
        formData.cognome,
        formData.sesso,
        new Date(formData.dataNascita),
        codCatastale
      );

      const codiceControllo = this.calculateCodiceControllo(codiceFiscale);
      this.anagraficaForm.patchValue({ codiceFiscale: codiceFiscale + codiceControllo });
    } else {
      this.anagraficaForm.patchValue({ codiceFiscale: '' });
    }
  }

  private calculateCodiceFiscale(nome: string, cognome: string, sesso: string, dataNascita: Date, codCatastale: string): string {
    const monthCodes: { [key: string]: string } = {
      '01': 'A', '02': 'B', '03': 'C', '04': 'D', '05': 'E', '06': 'H',
      '07': 'L', '08': 'M', '09': 'P', '10': 'R', '11': 'S', '12': 'T'
    };

    // Extract year, month, and day from the date
    const year = dataNascita.getFullYear().toString().slice(-2);
    const monthIndex = (dataNascita.getMonth() + 1).toString().padStart(2, '0'); // Get month as 'MM'
    const month = monthCodes[monthIndex]; // Use the month index to get the corresponding code
    const day = dataNascita.getDate();

    // Adjust day for female
    const adjustedDay = sesso === 'F' ? day + 40 : day;

    // Get the first three consonants of the surname
    const surnameConsonants = cognome.replace(/[AEIOU]/gi, '').toUpperCase().match(/.{1,3}/g) || [];
    const surnamePart = (surnameConsonants.length > 0 ? surnameConsonants.join('') : cognome.toUpperCase()).slice(0, 3).padEnd(3, 'X');

    // Get the first three consonants of the name
    const nameConsonants = nome.replace(/[AEIOU]/gi, '').toUpperCase().match(/.{1,3}/g) || [];
    const namePart = (nameConsonants.length > 0 ? nameConsonants.join('') : nome.toUpperCase()).slice(0, 3).padEnd(3, 'X');

    // Construct the codice fiscale
    const codiceFiscale = `${surnamePart}${namePart}${year}${month}${adjustedDay.toString().padStart(2, '0')}${codCatastale}`;

    return codiceFiscale;
  }

  private calculateCodiceControllo(codiceFiscale: string): string {
    const CF_FX = codiceFiscale.toUpperCase();
    const alpha_dispari = [];
    const alpha_pari = [];

    let somma_dispari = 0; // Initialize sum for odd positions
    let somma_pari = 0;    // Initialize sum for even positions
    let somma_controllo = 0; // Initialize control sum
    let lettera_controllo: string;

    // Calculate sums based on the character positions
    for (let i = 0; i < CF_FX.length; i++) {
      if (i % 2 !== 1) { // Odd index (0-based)
        alpha_dispari[i] = CF_FX.charAt(i);
        switch (alpha_dispari[i]) {
          case '0': case 'A': alpha_dispari[i] = 1; break;
          case '1': case 'B': alpha_dispari[i] = 0; break;
          case '2': case 'C': alpha_dispari[i] = 5; break;
          case '3': case 'D': alpha_dispari[i] = 7; break;
          case '4': case 'E': alpha_dispari[i] = 9; break;
          case '5': case 'F': alpha_dispari[i] = 13; break;
          case '6': case 'G': alpha_dispari[i] = 15; break;
          case '7': case 'H': alpha_dispari[i] = 17; break;
          case '8': case 'I': alpha_dispari[i] = 19; break;
          case '9': case 'J': alpha_dispari[i] = 21; break;
          case 'K': alpha_dispari[i] = 2; break;
          case 'L': alpha_dispari[i] = 4; break;
          case 'M': alpha_dispari[i] = 18; break;
          case 'N': alpha_dispari[i] = 20; break;
          case 'O': alpha_dispari[i] = 11; break;
          case 'P': alpha_dispari[i] = 3; break;
          case 'Q': alpha_dispari[i] = 6; break;
          case 'R': alpha_dispari[i] = 8; break;
          case 'S': alpha_dispari[i] = 12; break;
          case 'T': alpha_dispari[i] = 14; break;
          case 'U': alpha_dispari[i] = 16; break;
          case 'V': alpha_dispari[i] = 10; break;
          case 'W': alpha_dispari[i] = 22; break;
          case 'X': alpha_dispari[i] = 25; break;
          case 'Y': alpha_dispari[i] = 24; break;
          case 'Z': alpha_dispari[i] = 23; break;
        }
        // Sum for odd positions
        somma_dispari += Number(alpha_dispari[i]);
      } else { // Even index (0-based)
        alpha_pari[i] = CF_FX.charAt(i);
        switch (alpha_pari[i]) {
          case '0': case 'A': alpha_pari[i] = 0; break;
          case '1': case 'B': alpha_pari[i] = 1; break;
          case '2': case 'C': alpha_pari[i] = 2; break;
          case '3': case 'D': alpha_pari[i] = 3; break;
          case '4': case 'E': alpha_pari[i] = 4; break;
          case '5': case 'F': alpha_pari[i] = 5; break;
          case '6': case 'G': alpha_pari[i] = 6; break;
          case '7': case 'H': alpha_pari[i] = 7; break;
          case '8': case 'I': alpha_pari[i] = 8; break;
          case '9': case 'J': alpha_pari[i] = 9; break;
          case 'J': alpha_pari[i] = 9; break;
          case 'K': alpha_pari[i] = 10; break;
          case 'L': alpha_pari[i] = 11; break;
          case 'M': alpha_pari[i] = 12; break;
          case 'N': alpha_pari[i] = 13; break;
          case 'O': alpha_pari[i] = 14; break;
          case 'P': alpha_pari[i] = 15; break;
          case 'Q': alpha_pari[i] = 16; break;
          case 'R': alpha_pari[i] = 17; break;
          case 'S': alpha_pari[i] = 18; break;
          case 'T': alpha_pari[i] = 19; break;
          case 'U': alpha_pari[i] = 20; break;
          case 'V': alpha_pari[i] = 21; break;
          case 'W': alpha_pari[i] = 22; break;
          case 'X': alpha_pari[i] = 23; break;
          case 'Y': alpha_pari[i] = 24; break;
          case 'Z': alpha_pari[i] = 25; break;
        }
        // Sum for even positions
        somma_pari += Number(alpha_pari[i]);
      }
    }

    // Final control sum
    somma_controllo = (somma_dispari + somma_pari) % 26;

    // Array of letters corresponding to the control sum
    const caratteri_lista = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // Get the control letter based on the control sum
    lettera_controllo = caratteri_lista[somma_controllo];

    return lettera_controllo;
  }

  private populateRegioniProvinceCittàCap(): void {
    this.cittaNascita = [...new Set(this.comuni.map(comune => comune.comune))];
    this.Cod_Catastale = [...new Set(this.comuni.map(Cod_Catastale => Cod_Catastale.Cod_Catastale))];
  }

  searchCittaNascita: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] : this.cittaNascita.filter(citta => citta.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  onCitySelect(event: any) {
    const selectedCity = event.item; // Get the selected item
    this.anagraficaForm.patchValue({ cittaNascita: selectedCity }); // Update the form control
    this.updateCodiceFiscale(); // Call to update the codice fiscale
  }

  onSubmit() {
    if (this.anagraficaForm.valid) {
      const formData = this.anagraficaForm.value;
      // Convert 'sesso' to an integer
      formData.sesso = formData.sesso === 'M' ? 0 : (formData.sesso === 'F' ? 1 : null);

      // Emit the form data including recapito and idTipoRecapito
      this.onNext.emit(formData);
    }
  }
}