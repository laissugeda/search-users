import { Component, inject, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GitHubService, GitHubUser } from '../../services/github.service'
import { CacheService } from '../../services/cache.service'
import { SearchInputComponent } from '../../components/search-input/search-input.component'
import { UserCardComponent } from '../../components/user-card/user-card.component'

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, UserCardComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  private githubService = inject(GitHubService)
  private cacheService = inject(CacheService)

  users = signal<GitHubUser[]>([])
  loading = signal(false)
  errorMessage = signal<string | null>(null)
  inputValue = signal('')
  history = signal<any[]>([])

  ngOnInit() {
    this.loadHistory()
  }

  async loadHistory() {
    try {
      const data = await this.cacheService.getHistory()
      this.history.set(data)
    } catch (err) {
      console.error('Erro ao carregar histórico:', err)
    }
  }

  selectFromHistory(item: any) {
    this.users.set([item])
    this.errorMessage.set(null)
  }

  onSearch(query: string) {
    if (!query.trim()) return

    this.loading.set(true)
    this.errorMessage.set(null)

    this.githubService.searchUsers(query).subscribe({
      next: (data) => {
        this.users.set(data)
        this.loading.set(false)

        if (data.length > 0) {
          const firstUser = data[0]
          this.saveToCache(firstUser)
        }
      },
      error: (err) => {
        this.errorMessage.set('Erro ao buscar usuários. Verifique sua conexão ou limite de API.')
        this.loading.set(false)
        console.error(err)
      },
    })
  }

  private saveToCache(user: GitHubUser) {
    this.githubService.getRepos(user.login).subscribe({
      next: (repos) => {
        this.cacheService.saveUser(user, repos).then(() => {
          this.loadHistory()
        })
      },
    })
  }
}
