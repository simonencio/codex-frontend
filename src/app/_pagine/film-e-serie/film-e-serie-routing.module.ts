import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmESerieComponent } from './film-e-serie.component';

const routes: Routes = [{ path: '', component: FilmESerieComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmESerieRoutingModule { }
