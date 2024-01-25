import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FooterComponent } from '../partials/footer/footer.component';
import { HeaderComponent } from '../partials/header/header.component';
import { SidebarComponent } from '../partials/sidebar/sidebar.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, FooterComponent, TableComponent],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

}
