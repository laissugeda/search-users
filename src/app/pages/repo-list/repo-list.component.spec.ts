import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RepoListComponent } from './repo-list.component'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting } from '@angular/common/http/testing'

describe('RepoListComponent', () => {
  let component: RepoListComponent
  let fixture: ComponentFixture<RepoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(RepoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})