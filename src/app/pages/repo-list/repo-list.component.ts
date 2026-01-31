import { Component, OnInit, inject, signal } from '@angular/core'
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
  private GitHubService = inject(GitHubService)

  username = signal('')
  repos = signal<GitHubRepo[]>([])
  loading = signal(false)

  ngOnInit() {
    // Pega o 'username' da URL
    const userParam = this.route.snapshot.paramMap.get('username')
    if (userParam) {
      this.username.set(userParam)
      this.loadRepos(userParam)
    }
  }

  loadRepos(user: string) {
    this.loading.set(true)
    this.GitHubService.getRepos(user).subscribe({
      next: (data) => {
        this.repos.set(data)
        this.loading.set(false)
      },
      error: () => this.loading.set(false)
    })
  }
}