import { Component } from '@angular/core';

@Component({
    selector: 'app-registrazione',
    templateUrl: './registrazione.component.html',
    styleUrls: ['./registrazione.component.scss']
})
export class RegistrazioneComponent {
    currentStep: number = 1;
    userData: any = {};

    onNext(data: any) {
        this.userData = { ...this.userData, ...data }; // Merge new data into userData
        this.currentStep++; // Move to the next step
    }

    onBack() {
        this.currentStep = 1; // Set to 1 to go back to the EmailComponent
    }
}