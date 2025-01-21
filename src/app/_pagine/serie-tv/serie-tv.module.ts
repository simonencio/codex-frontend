import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SerieTvRoutingModule } from './serie-tv-routing.module';
import { SerieTvComponent } from './serie-tv.component';
import { FormsModule, NgModel } from '@angular/forms';


@NgModule({
  declarations: [
    SerieTvComponent,

  ],
  imports: [
    CommonModule,
    SerieTvRoutingModule,
    FormsModule,
  ]
})
export class SerieTvModule { }
