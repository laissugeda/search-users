import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { GitHubService, GitHubRepo, GitHubUser } from '../../services/github.service'
import { CacheService } from '../../services/cache.service'
import { NotificationService } from '../../services/notification.service'

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css'],
})
export class RepoListComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private githubService = inject(GitHubService)
  private cacheService = inject(CacheService)
  public notification = inject(NotificationService)

  username = signal('')
  repos = signal<GitHubRepo[]>([])
  loading = signal(false)
  user = signal<any>(null)

  sortOrder = signal<string>('stars-desc')
  searchTerm = signal<string>('')

  sortedRepos = computed(() => {
    const term = this.searchTerm().toLowerCase()
    const order = this.sortOrder()

    let list = this.repos().filter(
      (repo) =>
        repo.name.toLowerCase().includes(term) ||
        (repo.description && repo.description.toLowerCase().includes(term)),
    )

    return list.sort((a, b) => {
      switch (order) {
        case 'stars-desc':
          return b.stargazers_count - a.stargazers_count
        case 'stars-asc':
          return a.stargazers_count - b.stargazers_count
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })
  })

  ngOnInit() {
    const userFromUrl = this.route.snapshot.paramMap.get('username')

    if (userFromUrl) {
      this.username.set(userFromUrl)

      this.githubService.getUser(userFromUrl).subscribe({
        next: (user) => {
          this.loadRepos(user)
        },
        error: () => {
          this.notification.notify('Não foi possível carregar os dados do usuário.', true)
        },
      })
    }
  }

  loadRepos(user: GitHubUser) {
    this.loading.set(true)

    this.githubService.getRepos(user.login).subscribe({
      next: (repos) => {
        this.repos.set(repos)

        this.cacheService.saveUser(user, repos)

        this.loading.set(false)
      },
      error: (err) => {
        this.loading.set(false)
        console.error('Erro ao carregar repositórios:', err)
      },
    })
  }
}
