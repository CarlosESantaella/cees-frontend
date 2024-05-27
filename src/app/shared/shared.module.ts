import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';



@NgModule({
  declarations: [
    
  ],
  imports: [
    SafeHtmlPipe
  ],
  exports: [
    SafeHtmlPipe
  ]
})
export class SharedModule { }
