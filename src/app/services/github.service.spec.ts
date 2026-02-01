import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { GitHubService } from './github.service'
import { CacheService } from './cache.service'

describe('GitHubService', () => {
  let service: GitHubService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GitHubService,
        provideHttpClient(),
        provideHttpClientTesting(),
        // MOCK DO CACHE PARA EVITAR ERRO DE INDEXEDDB
        {
          provide: CacheService,
          useValue: {
            saveUser: () => Promise.resolve(),
            getHistory: () => Promise.resolve([]),
            openDB: () => Promise.resolve(),
          },
        },
      ],
    })
    service = TestBed.inject(GitHubService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('deve buscar um usuário pelo nome', () => {
    const mockUser = { login: 'laissugeda', name: 'Lais Sugeda' }
    const mockRepos = [{ name: 'repo-1' }]

    service.getUser('laissugeda').subscribe((user: any) => {
      expect(user).toBeTruthy()
    })

    const userReq = httpMock.expectOne((req) => req.url.includes('users/laissugeda'))
    userReq.flush(mockUser)

    const repoReq = httpMock.expectOne((req) => req.url.includes('/repos'))
    repoReq.flush(mockRepos)
  })
})
