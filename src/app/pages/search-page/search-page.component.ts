import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GithubService, GithubUser } from '../../services/github.service'
import { SearchInputComponent } from '../../components/search-input/search-input.component'
import { UserCardComponent } from '../../components/user-card/user-card.component'

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, UserCardComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent {
  private githubService = inject(GithubService)

  // Usando Signals para estado reativo
  users = signal<GithubUser[]>([])
  loading = signal(false)
  errorMessage = signal<string | null>(null)
  inputValue = signal('')

  onSearch(query: string) {
    if (!query.trim()) return

    this.inputValue.set(query.trim())
    this.loading.set(true)
    this.errorMessage.set(null)

    this.githubService.searchUsers(query).subscribe({
      next: (data) => {
        this.users.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.errorMessage.set('Erro ao buscar usuários. Limite de taxa da API atingido.')
        this.loading.set(false)
        console.error(err)
      },
    })
  }
}
