import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmESerieRoutingModule } from './film-e-serie-routing.module';
import { FilmESerieComponent } from './film-e-serie.component';
import { EpisodModalComponent } from 'src/app/_componenti/episodi-modal/episodi-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    FilmESerieComponent,
    EpisodModalComponent

  ],
  imports: [
    CommonModule,
    FilmESerieRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class FilmESerieModule { }
