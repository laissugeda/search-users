import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, forkJoin, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

export interface GithubUser {
  login: string
  name: string
  avatar_url: string
  followers: number
  following: number
  starredCount: number
  location: string | null
  bio: string | null
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  private http = inject(HttpClient)
  private readonly apiUrl = 'https://api.github.com'

  searchUsers(query: string, page: number = 1): Observable<GithubUser[]> {
    // Adicionei per_page=10 para economizar sua cota de API enquanto testa
    return this.http
      .get<{ items: any[] }>(`${this.apiUrl}/search/users?q=${query}&page=${page}&per_page=10`)
      .pipe(
        switchMap((response) => {
          if (!response.items || response.items.length === 0) return of([])

          const detailedRequests = response.items.map((user) => {
            const profile$ = this.http.get<any>(`${this.apiUrl}/users/${user.login}`)
            const starred$ = this.http.get<any[]>(`${this.apiUrl}/users/${user.login}/starred`)

            return forkJoin([profile$, starred$]).pipe(
              map(([profile, starred]) => ({
                login: profile.login,
                name: profile.name || profile.login,
                avatar_url: profile.avatar_url,
                followers: profile.followers,
                following: profile.following,
                location: profile.location,
                bio: profile.bio,
                starredCount: starred.length,
              })),
            )
          })

          return forkJoin(detailedRequests)
        }),
      )
  }
}
