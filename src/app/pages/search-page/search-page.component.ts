import { Component, inject, signal, OnInit, computed, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GitHubService, GitHubUser } from '../../services/github.service'
import { CacheService } from '../../services/cache.service'
import { SearchInputComponent } from '../../components/search-input/search-input.component'
import { UserCardComponent } from '../../components/user-card/user-card.component'
import { NotificationService } from '../../services/notification.service'
import { Router } from '@angular/router'

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
  public notification = inject(NotificationService)
  private router = inject(Router)

  users = signal<GitHubUser[]>([])
  loading = signal(false)
  errorMessage = signal<string | null>(null)
  inputValue = signal('')
  history = signal<any[]>([])

  @HostListener('window:offline')
  onOffline() {
    this.notification.notify('Você perdeu a conexão com a internet. Ativando modo offline.', true)
  }

  @HostListener('window:online')
  onOnline() {
    this.notification.notify('Conexão restabelecida! Você pode buscar novos dados.')
  }

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
    this.inputValue.set(item.login)
    this.errorMessage.set(null)

    this.router.navigate(['/repos', item.login])
  }

  onSearch(query: string) {
    if (!navigator.onLine) {
      this.notification.notify('Não é possível buscar novos dados sem internet.', true)
      return
    }

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
      },
      error: (err) => {
        this.errorMessage.set('Erro ao buscar usuários. Verifique sua conexão ou limite de API.')
        this.loading.set(false)
        console.error(err)
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
