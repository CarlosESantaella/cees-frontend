import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-animated-background',
    imports: [CommonModule],
    template: `
  <div class="background">
  </div>
`,
    styleUrl: './animated-background.component.css'
})
export class AnimatedBackgroundComponent {

}
