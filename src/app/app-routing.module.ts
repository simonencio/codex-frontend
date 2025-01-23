import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: '**', redirectTo: '/Registrazione' },
  { path: '', redirectTo: '/Intro', pathMatch: 'full' },
  { path: 'Registrazione', loadChildren: () => import('./_pagine/registrazione/registrazione.module').then(m => m.RegistrazioneModule) },
  { path: 'login', loadChildren: () => import('./_pagine/login/login.module').then(m => m.LoginModule) },
  { path: 'BackEnd', loadChildren: () => import('./_pagine/back-end/back-end.module').then(m => m.BackEndModule) },
  { path: 'FilmESerie', loadChildren: () => import('./_pagine/film-e-serie/film-e-serie.module').then(m => m.FilmESerieModule) },
  { path: 'GestioneAccount', loadChildren: () => import('./_pagine/gestione-account/gestione-account.module').then(m => m.GestioneAccountModule) },
  { path: 'SerieTv', loadChildren: () => import('./_pagine/serie-tv/serie-tv.module').then(m => m.SerieTvModule) },
  { path: 'Film', loadChildren: () => import('./_pagine/film/film.module').then(m => m.FilmModule) },
  { path: 'Intro', loadChildren: () => import('./_pagine/intro/intro.module').then(m => m.IntroModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
