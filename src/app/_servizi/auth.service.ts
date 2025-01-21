import { Injectable } from '@angular/core';
import { Auth } from '../_type/auth.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static auth: Auth;
  private obsAuth$: BehaviorSubject<Auth>;

  constructor() {
    AuthService.auth = this.leggiAuthDaLocalStorage();
    this.obsAuth$ = new BehaviorSubject<Auth>(AuthService.auth);
  }

  leggiObsAuth() {
    return this.obsAuth$;
  }

  settaObsAuth(dati: Auth): void {
    AuthService.auth = dati;
    this.scriviAuthSuLocalStorage(dati); // Save to session storage
    this.obsAuth$.next(dati);
  }

  leggiAuthDaLocalStorage(): Auth {
    const tmp: string | null = sessionStorage.getItem("auth");
    let auth: Auth;
    if (tmp !== null) {
      auth = JSON.parse(tmp);
    } else {
      auth = {
        idLingua: 1,
        idUtente: null,
        idRuolo: null,
        idStato: null,
        tk: null,
        nome: null,
        abilita: null,
        idContatto: null // Ensure this is included
      };
    }
    return auth;
  }

  scriviAuthSuLocalStorage(auth: Auth): void {
    const tmp: string = JSON.stringify(auth);
    sessionStorage.setItem("auth", tmp); // Fixed the key by removing the extra space
  }

  // Method to set the token
  setToken(token: string): void {
    AuthService.auth.tk = token; // Set the token in the Auth object
    this.settaObsAuth(AuthService.auth); // Update the BehaviorSubject and localStorage
  }

  // Method to get the token
  getToken(): string | null {
    return AuthService.auth.tk; // Return the token
  }

  // Method to log out
  logout(): void {
    console.log('Logging out...'); // Debugging statement
    AuthService.auth.tk = null; // Clear the token in the Auth object
    this.scriviAuthSuLocalStorage(AuthService.auth); // Update local storage
    this.settaObsAuth(AuthService.auth); // Notify subscribers

    // Clear both localStorage and sessionStorage
    localStorage.clear(); // Clear local storage
    sessionStorage.clear(); // Clear session storage

    console.log('Token after logout:', AuthService.auth.tk); // Check the token value

  }
}