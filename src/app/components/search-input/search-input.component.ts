import { Component, EventEmitter, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  @Output() search = new EventEmitter<string>()

  inputValue = ''

  emitSearch() {
    if (!this.inputValue.trim()) return
    this.search.emit(this.inputValue.trim())
  }
}
