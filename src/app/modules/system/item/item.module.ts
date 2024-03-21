import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRoutingModule } from './item-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { CreateComponent as CreateRateComponent } from './list-rates/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  // declarations: [
  //  CreateRateComponent,
  // ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    // BrowserAnimationsModule,
    // MultiSelectModule,
    // ReactiveFormsModule,
  ]
})
export class ItemModule { }
