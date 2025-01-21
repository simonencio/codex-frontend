import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestioneAccountComponent } from './gestione-account.component';

const routes: Routes = [{ path: '', component: GestioneAccountComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestioneAccountRoutingModule { }
