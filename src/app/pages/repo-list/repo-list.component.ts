import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { GitHubService, GitHubRepo } from '../../services/github.service'

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private githubService = inject(GitHubService)

  username = signal('')
  repos = signal<GitHubRepo[]>([])
  loading = signal(false)
  
  sortOrder = signal<string>('stars-desc')

  sortedRepos = computed(() => {
    const order = this.sortOrder()
    const list = [...this.repos()]

    return list.sort((a, b) => {
      switch (order) {
        case 'stars-desc': return b.stargazers_count - a.stargazers_count
        case 'stars-asc': return a.stargazers_count - b.stargazers_count
        case 'name-asc': return a.name.localeCompare(b.name)
        case 'name-desc': return b.name.localeCompare(a.name)
        default: return 0
      }
    })
  })

  ngOnInit() {
    const userParam = this.route.snapshot.paramMap.get('username')
    if (userParam) {
      this.username.set(userParam)
      this.loadRepos(userParam)
    }
  }

  loadRepos(user: string) {
    this.loading.set(true)
    this.githubService.getRepos(user).subscribe({
      next: (data) => {
        this.repos.set(data)
        this.loading.set(false)
      },
      error: () => this.loading.set(false)
    })
  }
}