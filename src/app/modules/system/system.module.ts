import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [],
  imports: [
    SystemRoutingModule,
    SharedModule,
    ImageCropperModule
  ]
})
export class SystemModule { }
