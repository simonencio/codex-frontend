import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-credenziali',
  templateUrl: './credenziali.component.html',
  styleUrls: ['./credenziali.component.scss']
})
export class CredenzialiComponent implements OnInit {
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  credenzialiForm: FormGroup;
  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder) {
    this.credenzialiForm = this.fb.group({
      psw: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // No need to set user value anymore
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit() {
    if (this.credenzialiForm.valid) {
      const formData = this.credenzialiForm.value;

      // Hash the password
      const hashedPassword = await this.hashString(formData.psw);

      // Emit the hashed password
      this.onNext.emit({
        psw: hashedPassword // Emit the hashed password
      });
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