import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SearchPageComponent } from './search-page.component'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { CacheService } from '../../services/cache.service'

describe('SearchPageComponent', () => {
  let component: SearchPageComponent
  let fixture: ComponentFixture<SearchPageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPageComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CacheService,
          useValue: {
            getHistory: () => Promise.resolve([]),
            saveSearch: () => Promise.resolve(),
            openDB: () => Promise.resolve(),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SearchPageComponent)
    component = fixture.componentInstance

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('deve iniciar com a lista de histórico vazia se o cache estiver limpo', async () => {
    await fixture.whenStable()
    if ((component as any).history) {
      expect((component as any).history().length).toBe(0)
    }
  })
})
