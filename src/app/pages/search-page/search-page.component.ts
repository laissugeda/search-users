import { Component, inject, signal, OnInit, computed } from '@angular/core'
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
    const trimmedQuery = query.trim()

    this.inputValue.set(trimmedQuery)

    if (!trimmedQuery) {
      this.users.set([])
      return
    }

    this.loading.set(true)
    this.errorMessage.set(null)

    this.githubService.searchUsers(trimmedQuery).subscribe({
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

  showEmptyState = computed(() => {
    return (
      !this.loading() &&
      !this.errorMessage() &&
      this.users().length === 0 &&
      this.inputValue().trim().length > 0
    )
  })

  isInvalidUser = computed(() => {
    const username = this.inputValue().trim()
    if (username.length === 0) return false

    // Regras do GitHub:
    // ^[a-z\d] -> Começa com alfanumérico
    // (?:[a-z\d]|-(?=[a-z\d])){0,38} -> Seguido por hifens (não consecutivos) ou alfanuméricos
    // $ -> Termina com alfanumérico (implícito na regra acima)
    // Case insensitive (i)
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

    return !githubUsernameRegex.test(username)
  })
}
