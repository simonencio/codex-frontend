import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackEndRoutingModule } from './back-end-routing.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BackEndComponent } from './back-end.component';
import { SerieTvComponent } from 'src/app/_componenti/_SerieTv/serie-tv/serie-tv.component';
import { ModificaSerieTvComponent } from 'src/app/_componenti/_SerieTv/modifica-serie-tv/modifica-serie-tv.component';
import { AggiungiSerieTvComponent } from 'src/app/_componenti/_SerieTv/aggiungi-serie-tv/aggiungi-serie-tv.component';
import { CancellaSerieTvComponent } from 'src/app/_componenti/_SerieTv/cancella-serie-tv/cancella-serie-tv.component';
import { ListaSerieTvComponent } from 'src/app/_componenti/_SerieTv/lista-serie-tv/lista-serie-tv.component';
import { FilmComponent } from 'src/app/_componenti/_Film/film/film.component';
import { ModificaFilmComponent } from 'src/app/_componenti/_Film/modifica-film/modifica-film.component';
import { AggiungiFilmComponent } from 'src/app/_componenti/_Film/aggiungi-film/aggiungi-film.component';
import { CancellaFilmComponent } from 'src/app/_componenti/_Film/cancella-film/cancella-film.component';
import { ListaFilmComponent } from 'src/app/_componenti/_Film/lista-film/lista-film.component';
import { ModificaEpisodiComponent } from 'src/app/_componenti/_Episodi/modifica-episodi/modifica-episodi.component';
import { AggiungiEpisodioComponent } from 'src/app/_componenti/_Episodi/aggiungi-episodi/aggiungi-episodi.component';
import { CancellaEpisodiComponent } from 'src/app/_componenti/_Episodi/cancella-episodi/cancella-episodi.component';
import { ListaEpisodiComponent } from 'src/app/_componenti/_Episodi/lista-episodi/lista-episodi.component';
import { EpisodiComponent } from 'src/app/_componenti/_Episodi/episodi/episodi.component';
import { ModificaCategorieComponent } from 'src/app/_componenti/_Categorie/modifica-categorie/modifica-categorie.component';
import { AggiungiCategorieComponent } from 'src/app/_componenti/_Categorie/aggiungi-categorie/aggiungi-categorie.component';
import { CancellaCategorieComponent } from 'src/app/_componenti/_Categorie/cancella-categorie/cancella-categorie.component';
import { ListaCategorieComponent } from 'src/app/_componenti/_Categorie/lista-categorie/lista-categorie.component';
import { CategorieComponent } from 'src/app/_componenti/_Categorie/categorie/categorie.component';
import { AggiungiTipologieIndirizziComponent } from 'src/app/_componenti/_TipologieIndirizzi/aggiungi-tipologieIndirizzi/aggiungi-tipologieIndirizzi.component';
import { ModificaTipologieIndirizziComponent } from 'src/app/_componenti/_TipologieIndirizzi/modifica-tipologieIndirizzi/modifica-tipologieIndirizzi.component';
import { CancellaTipologieIndirizziComponent } from 'src/app/_componenti/_TipologieIndirizzi/cancella-tipologieIndirizzi/cancella-tipologieIndirizzi.component';
import { ListaTipologieIndirizziComponent } from 'src/app/_componenti/_TipologieIndirizzi/lista-tipologieIndirizzi/lista-tipologieIndirizzi.component';
import { TipologieIndirizziComponent } from 'src/app/_componenti/_TipologieIndirizzi/tipologieIndirizzi/tipologieIndirizzi.component';
import { ModificaIndirizziComponent } from 'src/app/_componenti/_Indirizzi/modifica-Indirizzi/modifica-Indirizzi.component';
import { AggiungiIndirizziComponent } from 'src/app/_componenti/_Indirizzi/aggiungi-Indirizzi/aggiungi-Indirizzi.component';
import { CancellaIndirizziComponent } from 'src/app/_componenti/_Indirizzi/cancella-Indirizzi/cancella-Indirizzi.component';
import { ListaIndirizziComponent } from 'src/app/_componenti/_Indirizzi/lista-Indirizzi/lista-Indirizzi.component';
import { IndirizziComponent } from 'src/app/_componenti/_Indirizzi/Indirizzi/Indirizzi.component';
import { ModificaProfiliComponent } from 'src/app/_componenti/_Profili/modifica-profili/modifica-profili.component';
import { AggiungiProfiliComponent } from 'src/app/_componenti/_Profili/aggiungi-profili/aggiungi-profili.component';
import { CancellaProfiliComponent } from 'src/app/_componenti/_Profili/cancella-profili/cancella-profili.component';
import { ListaProfiliComponent } from 'src/app/_componenti/_Profili/lista-profili/lista-profili.component';
import { ProfiliComponent } from 'src/app/_componenti/_Profili/profili/profili.component';
import { ModificaTipoRecapitoComponent } from 'src/app/_componenti/_TipoRecapito/modifica-tipoRecapito/modifica-tipoRecapito.component';
import { AggiungiTipoRecapitoComponent } from 'src/app/_componenti/_TipoRecapito/aggiungi-tipoRecapito/aggiungi-tipoRecapito.component';
import { CancellaTipoRecapitoComponent } from 'src/app/_componenti/_TipoRecapito/cancella-tipoRecapito/cancella-tipoRecapito.component';
import { ListaTipoRecapitoComponent } from 'src/app/_componenti/_TipoRecapito/lista-tipoRecapito/lista-tipoRecapito.component';
import { TipoRecapitoComponent } from 'src/app/_componenti/_TipoRecapito/tipoRecapito/tipoRecapito.component';
import { ModificaCreditoComponent } from 'src/app/_componenti/_Crediti/modifica-crediti/modifica-crediti.component';
import { AggiungiCreditoComponent } from 'src/app/_componenti/_Crediti/aggiungi-crediti/aggiungi-crediti.component';
import { CancellaCreditoComponent } from 'src/app/_componenti/_Crediti/cancella-crediti/cancella-crediti.component';
import { ListaCreditoComponent } from 'src/app/_componenti/_Crediti/lista-crediti/lista-crediti.component';
import { CreditoComponent } from 'src/app/_componenti/_Crediti/crediti/crediti.component';
import { ModificaRecapitiComponent } from 'src/app/_componenti/_Recapiti/modifica-recapiti/modifica-recapiti.component';
import { AggiungiRecapitiComponent } from 'src/app/_componenti/_Recapiti/aggiungi-recapiti/aggiungi-recapiti.component';
import { CancellaRecapitiComponent } from 'src/app/_componenti/_Recapiti/cancella-recapiti/cancella-recapiti.component';
import { ListaRecapitiComponent } from 'src/app/_componenti/_Recapiti/lista-recapiti/lista-recapiti.component';
import { RecapitiComponent } from 'src/app/_componenti/_Recapiti/recapiti/recapiti.component';


@NgModule({
  declarations: [
    BackEndComponent,
    ModificaSerieTvComponent,
    AggiungiSerieTvComponent,
    CancellaSerieTvComponent,
    ListaSerieTvComponent,
    ModificaFilmComponent,
    AggiungiFilmComponent,
    CancellaFilmComponent,
    ListaFilmComponent,
    SerieTvComponent,
    FilmComponent,
    ModificaEpisodiComponent,
    AggiungiEpisodioComponent,
    CancellaEpisodiComponent,
    ListaEpisodiComponent,
    EpisodiComponent,
    ModificaCategorieComponent,
    AggiungiCategorieComponent,
    CancellaCategorieComponent,
    ListaCategorieComponent,
    CategorieComponent,
    ModificaTipologieIndirizziComponent,
    AggiungiTipologieIndirizziComponent,
    CancellaTipologieIndirizziComponent,
    ListaTipologieIndirizziComponent,
    TipologieIndirizziComponent,
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

    ModificaTipoRecapitoComponent,
    AggiungiTipoRecapitoComponent,
    CancellaTipoRecapitoComponent,
    ListaTipoRecapitoComponent,
    TipoRecapitoComponent,

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
    BackEndRoutingModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet
  ]
})
export class BackEndModule { }
