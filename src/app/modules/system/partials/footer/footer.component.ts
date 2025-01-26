import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  year: number = 0;

  constructor(){
    let date: any = new Date();
    this.year = date.getFullYear();
  }
}
