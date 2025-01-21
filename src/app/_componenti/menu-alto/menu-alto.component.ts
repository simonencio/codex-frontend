import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_servizi/auth.service';

@Component({
  selector: 'menu-alto',
  templateUrl: './menu-alto.component.html',
  styleUrls: ['./menu-alto.component.scss']
})
export class MenuAltoComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false; // Initialize to false
  idRuolo: number | null = null; // Initialize to null
  private intervalId: any; // To store the interval ID

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.leggiObsAuth().subscribe(auth => {
      this.isLoggedIn = !!auth.tk; // Update isLoggedIn based on the token
      this.idRuolo = this.getIdRuoloFromSessionStorage(); // Update idRuolo if needed
    });

    // Start polling for changes in sessionStorage
    this.intervalId = setInterval(() => {
      this.idRuolo = this.getIdRuoloFromSessionStorage(); // Update idRuolo periodically
    }, 1000); // Check every second
  }

  ngOnDestroy() {
    // Clean up the interval
    clearInterval(this.intervalId);
  }

  getIdRuoloFromSessionStorage(): number | null {
    const ruolo = sessionStorage.getItem('idRuolo'); // Retrieve idRuolo from sessionStorage
    return ruolo ? parseInt(ruolo, 10) : null; // Parse it as an integer or return null
  }

  clearLocalStorageAndNavigate() {
    this.authService.logout(); // Call the logout method to clear the token
    this.router.navigate(['/Registrazione']); // Navigate to the registration page
  }

  logout() {
    this.authService.logout(); // Call the logout method to clear the token
    this.router.navigate(['/login']); // Navigate to the login page after logout
  }

  navigateFilmESerie() {
    if (this.isLoggedIn) {
      this.router.navigate(['/FilmESerie']);
    } else {
      this.router.navigate(['/login']); // Navigate to login if not logged in
    }
  }

  navigateFilm() {
    if (this.isLoggedIn) {
      this.router.navigate(['/Film']);
    } else {
      this.router.navigate(['/login']); // Navigate to login if not logged in
    }
  }

  navigateSerieTv() {
    if (this.isLoggedIn) {
      this.router.navigate(['/SerieTv']);
    } else {
      this.router.navigate(['/login']); // Navigate to login if not logged in
    }
  }
}