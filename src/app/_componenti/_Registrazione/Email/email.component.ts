import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  credenzialiForm: FormGroup;
  userError: string | null = null; // Error message for user

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.credenzialiForm = this.fb.group({
      user: ['', [Validators.required, Validators.email]] // Email validation
    });
  }

  async onSubmit() {
    if (this.credenzialiForm.valid) {
      const formData = this.credenzialiForm.value;

      // Hash the email before checking existence
      const hashedUser = await this.hashString(formData.user);

      // Prepare the payload for checking existence
      const checkPayload = {
        user: hashedUser
      };

      // Check if the user exists
      this.http.post('/api/check-user', checkPayload).subscribe(
        (response) => {
          // If the response is successful, emit the hashed email
          this.onNext.emit({
            user: hashedUser  // Emit the hashed email
          });
          this.userError = null; // Clear any previous error
        },
        (error) => {
          // Handle the error and set the error message
          console.error(error);
          this.userError = error.error.error; // Set the error message
        }
      );
    }
  }

  private async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
  }
}



// import { Component, EventEmitter, Output } from '@angular/core'; import { FormBuilder, FormGroup, Validators } from '@angular/forms'; import { HttpClient } from '@angular/common/http';

// @Component({ selector: 'app-email', templateUrl: './email.component.html', styleUrls: ['./email.component.scss'] }) export class EmailComponent {
//   @Output() onNext: EventEmitter<any> = new EventEmitter(); credenzialiForm: FormGroup; userError: string | null = null; // Error message for user

//   constructor(private fb: FormBuilder, private http: HttpClient) {
//     this.credenzialiForm = this.fb.group({
//       user: ['', [Validators.required, Validators.email]] // Email validation }); }

// async onSubmit() {
//         if (this.credenzialiForm.valid) {
//           const formData = this.credenzialiForm.value;


  
//           // Hash the email before checking existence
//           const hashedUser = await this.hashString(formData.user);

//           // Prepare the payload for checking existence
//           const checkPayload = {
//             user: hashedUser
//           };

//           // Check if the user exists
//           this.http.post('/api/check-user', checkPayload).subscribe(
//             (response) => {
//               // If the response is successful, emit the hashed email
//               this.onNext.emit({
//                 user: hashedUser  // Emit the hashed email
//               });
//               this.userError = null; // Clear any previous error
//             },
//             (error) => {
//               // Handle the error and set the error message
//               console.error(error);
//               this.userError = error.error.error; // Set the error message
//             }
//           );
//         }
//       }

// private async hashString(input: string): Promise<string> { const encoder = new TextEncoder(); const data = encoder.encode(input); const hashBuffer = await crypto.subtle.digest('SHA-512', data); const hashArray = Array.from(new Uint8Array(hashBuffer)); const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join(''); return hashHex; }
//     }