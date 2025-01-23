import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }), // Start fully transparent
        animate('0.5s', style({ opacity: 1 })) // Fade in to fully opaque
      ])
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }), // Start fully opaque
        animate('0.5s', style({ opacity: 0 })) // Fade out to fully transparent
      ])
    ])
  ]
})
export class IntroComponent implements OnInit {
  isLeaving = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Start the loading simulation
    setTimeout(() => {
      this.isLeaving = true; // Trigger the fade-out animation
      setTimeout(() => {
        // Check for token in session storage
        const authData = sessionStorage.getItem('auth');
        if (authData) {
          const parsedAuthData = JSON.parse(authData);
          const token = parsedAuthData.tk; // Retrieve the token from the parsed object

          if (token) {
            // If token exists, redirect to FilmESerie
            this.router.navigate(['/FilmESerie']);
          } else {
            // If no token, redirect to login
            this.router.navigate(['/login']);
          }
        } else {
          // If no auth data, redirect to login
          this.router.navigate(['/login']);
        }
      }, 500); // Match this duration with the animation duration
    }, 3000); // Duration before starting the fade-out
  }
}