import { NgModule } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { RouterPreloader } from '@angular/router';



@NgModule({
  declarations: [
    LoginComponent,


  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,

  ]
})
export class LoginModule { }
