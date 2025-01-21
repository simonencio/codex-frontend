import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestioneAccountRoutingModule } from './gestione-account-routing.module';
import { GestioneAccountComponent } from './gestione-account.component';
import { CreditoComponent } from 'src/app/_componenti/_GestioneAccount/_Crediti/crediti-utente/crediti-utente.component';
import { ProfiliComponent } from 'src/app/_componenti/_GestioneAccount/_Profili/profili-utente/profili-utente.component';
import { RecapitiComponent } from 'src/app/_componenti/_GestioneAccount/_Recapiti/recapiti-utente/recapiti-utente.component';
import { IndirizziComponent } from 'src/app/_componenti/_GestioneAccount/_Indirizzi/Indirizzi-utente/Indirizzi-utente.component';
import { ModificaIndirizziComponent } from 'src/app/_componenti/_GestioneAccount/_Indirizzi/modifica-Indirizzi-utente/modifica-Indirizzi-utente.component';
import { AggiungiIndirizziComponent } from 'src/app/_componenti/_GestioneAccount/_Indirizzi/aggiungi-Indirizzi-utente/aggiungi-Indirizzi-utente.component';
import { CancellaIndirizziComponent } from 'src/app/_componenti/_GestioneAccount/_Indirizzi/cancella-Indirizzi-utente/cancella-Indirizzi-utente.component';
import { ListaIndirizziComponent } from 'src/app/_componenti/_GestioneAccount/_Indirizzi/lista-Indirizzi-utente/lista-Indirizzi-utente.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModificaProfiliComponent } from 'src/app/_componenti/_GestioneAccount/_Profili/modifica-profili-utente/modifica-profili-utente.component';
import { AggiungiProfiliComponent } from 'src/app/_componenti/_GestioneAccount/_Profili/aggiungi-profili-utente/aggiungi-profili-utente.component';
import { CancellaProfiliComponent } from 'src/app/_componenti/_GestioneAccount/_Profili/cancella-profili-utente/cancella-profili-utente.component';
import { ListaProfiliComponent } from 'src/app/_componenti/_GestioneAccount/_Profili/lista-profili-utente/lista-profili-utente.component';
import { ModificaTipoRecapitoComponent } from 'src/app/_componenti/_TipoRecapito/modifica-tipoRecapito/modifica-tipoRecapito.component';
import { AggiungiTipoRecapitoComponent } from 'src/app/_componenti/_TipoRecapito/aggiungi-tipoRecapito/aggiungi-tipoRecapito.component';
import { ModificaCreditoComponent } from 'src/app/_componenti/_GestioneAccount/_Crediti/modifica-crediti-utente/modifica-crediti-utente.component';
import { AggiungiCreditoComponent } from 'src/app/_componenti/_GestioneAccount/_Crediti/aggiungi-crediti-utente/aggiungi-crediti-utente.component';
import { CancellaCreditoComponent } from 'src/app/_componenti/_GestioneAccount/_Crediti/cancella-crediti-utente/cancella-crediti-utente.component';
import { ListaCreditoComponent } from 'src/app/_componenti/_GestioneAccount/_Crediti/lista-crediti-utente/lista-crediti-utente.component';
import { ModificaRecapitiComponent } from 'src/app/_componenti/_GestioneAccount/_Recapiti/modifica-recapiti-utente/modifica-recapiti-utente.component';
import { AggiungiRecapitiComponent } from 'src/app/_componenti/_GestioneAccount/_Recapiti/aggiungi-recapiti-utente/aggiungi-recapiti-utente.component';
import { CancellaRecapitiComponent } from 'src/app/_componenti/_GestioneAccount/_Recapiti/cancella-recapiti-utente/cancella-recapiti-utente.component';
import { ListaRecapitiComponent } from 'src/app/_componenti/_GestioneAccount/_Recapiti/lista-recapiti-utente/lista-recapiti-utente.component';



@NgModule({
  declarations: [
    GestioneAccountComponent,
    ModificaIndirizziComponent,
    AggiungiIndirizziComponent,
    CancellaIndirizziComponent,
    ListaIndirizziComponent,
    IndirizziComponent,

    ModificaProfiliComponent,
    AggiungiProfiliComponent,
    CancellaProfiliComponent,
    ListaProfiliComponent,
    ProfiliComponent,

    ModificaCreditoComponent,
    AggiungiCreditoComponent,
    CancellaCreditoComponent,
    ListaCreditoComponent,
    CreditoComponent,

    ModificaRecapitiComponent,
    AggiungiRecapitiComponent,
    CancellaRecapitiComponent,
    ListaRecapitiComponent,
    RecapitiComponent,
  ],
  imports: [
    CommonModule,
    GestioneAccountRoutingModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet
  ]
})
export class GestioneAccountModule { }
