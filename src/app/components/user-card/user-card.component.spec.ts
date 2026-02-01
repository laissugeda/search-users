import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UserCardComponent } from './user-card.component'
import { provideRouter } from '@angular/router'

describe('UserCardComponent', () => {
  let component: UserCardComponent
  let fixture: ComponentFixture<UserCardComponent>

  beforeEach(async () => {
    TestBed.resetTestingModule()
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(UserCardComponent)
    component = fixture.componentInstance

    fixture.componentRef.setInput('user', {
      login: 'laissugeda',
      avatar_url: 'https://github.com/laissugeda.png',
      html_url: 'https://github.com/laissugeda',
      name: 'Lais Sugeda',
      repos_url: '',
    })

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
