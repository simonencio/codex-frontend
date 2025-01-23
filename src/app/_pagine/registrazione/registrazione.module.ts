import { NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

import { RegistrazioneRoutingModule } from './registrazione-routing.module';
import { RegistrazioneComponent } from './registrazione.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResidenzaComponent } from 'src/app/_componenti/_Registrazione/residenza/residenza.component';
import { AnagraficaComponent } from 'src/app/_componenti/_Registrazione/anagrafica/anagrafica.component';
import { CredenzialiComponent } from 'src/app/_componenti/_Registrazione/credenziali/credenziali.component';
import { NgbDatepicker, NgbModule, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { EmailComponent } from 'src/app/_componenti/_Registrazione/Email/email.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    RegistrazioneComponent,
    ResidenzaComponent,
    AnagraficaComponent,
    CredenzialiComponent,
    EmailComponent,

  ],
  imports: [
    CommonModule,
    RegistrazioneRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeahead,
    HttpClientModule,
    NgbDatepicker,
    NgbModule
  ]
})
export class RegistrazioneModule { }
