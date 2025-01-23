import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuAltoComponent } from './_componenti/menu-alto/menu-alto.component';
import { PiePaginaComponent } from './_componenti/pie-pagina/pie-pagina.component';
import { LoginModule } from './_pagine/login/login.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { BackEndModule } from './_pagine/back-end/back-end.module';
import { RegistrazioneRoutingModule } from './_pagine/registrazione/registrazione-routing.module';
import { RegistrazioneModule } from './_pagine/registrazione/registrazione.module';
import { RegistrazioneComponent } from './_pagine/registrazione/registrazione.component';
import { FilmESerieModule } from './_pagine/film-e-serie/film-e-serie.module';
import { FilmModule } from './_pagine/film/film.module';
import { SerieTvModule } from './_pagine/serie-tv/serie-tv.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this




@NgModule({
  declarations: [
    AppComponent,
    MenuAltoComponent,
    PiePaginaComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    LoginModule,
    RegistrazioneModule,
    HttpClientModule,
    NgIf,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    BackEndModule,
    CommonModule,
    FilmESerieModule,
    FilmModule,
    SerieTvModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
