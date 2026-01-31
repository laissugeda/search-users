import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, forkJoin, of, tap } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { CacheService } from './cache.service'

export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  followers: number
  following: number
  location: string | null
  bio: string | null
}

export interface GitHubRepo {
  name: string
  description: string
  html_url: string
  stargazers_count: number
  language: string
}

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private http = inject(HttpClient)
  private readonly apiUrl = 'https://api.github.com'
  private cache = inject(CacheService)

  searchUsers(query: string, page: number = 1): Observable<GitHubUser[]> {
    return this.http
      .get<{ items: any[] }>(`${this.apiUrl}/search/users?q=${query}&page=${page}`)
      .pipe(
        switchMap((response) => {
          if (!response.items || response.items.length === 0) return of([])

          const detailedRequests = response.items.map((user) => {
            const profile$ = this.http.get<any>(`${this.apiUrl}/users/${user.login}`)

            return forkJoin([profile$]).pipe(
              map(([profile]) => ({
                login: profile.login,
                name: profile.name || profile.login,
                avatar_url: profile.avatar_url,
                followers: profile.followers,
                following: profile.following,
                location: profile.location,
                bio: profile.bio,
              })),
            )
          })

          return forkJoin(detailedRequests)
        }),
      )
  }
  getRepos(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(`${this.apiUrl}/users/${username}/repos?sort=updated`)
  }

  getUser(username: string) {
    return this.http.get<GitHubUser>(`${this.apiUrl}/users/${username}`).pipe(
      tap((user) => {
        this.getRepos(username).subscribe((repos) => {
          this.cache.saveUser(user, repos)
        })
      }),
    )
  }
}
