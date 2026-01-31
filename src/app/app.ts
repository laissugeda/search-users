import { Component } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { SearchPageComponent } from './pages/search-page/search-page.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, SearchPageComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
