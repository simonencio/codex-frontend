import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, delay, Observable, Observer, of, Subject, take, takeUntil } from 'rxjs';
import { IRispostaServer } from 'src/app/_interfacce/IRispostaServer.interface';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/_type/auth.type';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  stoControllando: boolean = false;
  reactiveForm: FormGroup;
  auth: BehaviorSubject<Auth>;
  private distruggi$ = new Subject<void>();
  passwordVisible: boolean = false; // Step 1: Add this line
  errorMessage: string | null = null; // Step 1: Add this line

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router
  ) {
    this.reactiveForm = this.fb.group({
      'utente': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      'password': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    });

    this.auth = this.authService.leggiObsAuth();
    console.log("AUTH ", this.auth);
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  ngOnDestroy(): void {
    this.distruggi$.next();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Toggle password visibility
  }

  accedi(): void {
    this.errorMessage = null; // Reset error message on new login attempt
    if (this.reactiveForm.invalid) {
      console.log("FORM NON VALIDO");
    } else {
      let utente = this.reactiveForm.controls["utente"].value;
      let password = this.reactiveForm.controls["password"].value;
      this.stoControllando = true;
      this.obsLogin(utente, password).subscribe(this.osservoLogin());
      console.log("ACCEDI ", utente, password);
    }
  }

  private obsLogin(utente: string, password: string): Observable<IRispostaServer> {
    return this.api.login(utente, password).pipe(
      delay(1000),
      take(1),
      catchError((err, caught) => {
        console.log("ERR ", err, caught);
        const nuovo: IRispostaServer = {
          data: null,
          message: "ERRORE LOGIN",
          error: err
        };
        return of(nuovo);
      }),
      takeUntil(this.distruggi$)
    );
  }

  private osservoLogin() {
    const osservatore: Observer<any> = {
      next: (rit: IRispostaServer) => {
        console.log("RITORNO ", rit);
        if (rit.data !== null && rit.message !== null) {
          const tk: string = rit.data.tk;
          const contenutoToken = UtilityService.leggiToken(tk);
          const auth: Auth = {
            idLingua: 1,
            tk: rit.data.tk,
            nome: contenutoToken.data.nome,
            idRuolo: contenutoToken.data.idContattoRuolo,
            idStato: contenutoToken.data.idStato,
            idUtente: contenutoToken.data.idUtente,
            abilita: contenutoToken.data.abilita,
            idContatto: contenutoToken.data.idContatto
          };
          this.authService.settaObsAuth(auth);
          this.authService.scriviAuthSuLocalStorage(auth);

          // Store the token and expiration time in local storage
          const expirationTime = new Date().getTime() + (60 * 60 * 1000); // 1 hour expiration time
          localStorage.setItem('token', tk);
          localStorage.setItem('expirationTime', expirationTime.toString());
          sessionStorage.setItem('idRuolo', auth.idRuolo ? auth.idRuolo.toString() : 'null'); // Store idRuolo

          console.log("Token stored:", tk);
          // Check the idRuolo to navigate to the appropriate route
          if (auth.idRuolo === 1) { // Assuming 1 is for "amministratore"
            this.router.navigateByUrl('/BackEnd'); // Navigate to admin dashboard
          } else if (auth.idRuolo === 2) { // Assuming 2 is for "utente"
            this.router.navigateByUrl('/FilmESerie'); // Navigate to user dashboard
          } else {
            console.log("Ruolo non riconosciuto");
          }
        } else {
          // Step 2: Set the error message when login fails
          this.errorMessage = "Credenziali errate. Riprova."; // Customize this message as needed
          console.log("ERRORE in osservoLogin");
        }
        this.stoControllando = false;
      },
      error: (err) => {
        console.log("ERRORE ", err);
        this.errorMessage = "Si è verificato un errore durante il login. Riprova."; // Customize this message as needed
        this.stoControllando = false;
      },
      complete: () => {
        this.stoControllando = false;
        console.log("COMPLETATO");
      }
    };
    return osservatore;
  }
}