import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SearchInputComponent } from './search-input.component'
import { FormsModule } from '@angular/forms'

describe('SearchInputComponent', () => {
  let component: SearchInputComponent
  let fixture: ComponentFixture<SearchInputComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent, FormsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(SearchInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('deve emitir o valor de busca ao clicar no botão', () => {
    let emittedValue = ''

    component.search.subscribe((val: string) => {
      emittedValue = val
    })

    component.inputValue = 'angular'
    fixture.detectChanges()

    const button = fixture.nativeElement.querySelector('button')
    button.click()

    expect(emittedValue).toBe('angular')
  })

  it('não deve emitir busca se o valor estiver vazio', () => {
    let wasEmitted = false

    component.search.subscribe(() => {
      wasEmitted = true
    })

    component.inputValue = ''
    component.emitSearch()

    expect(wasEmitted).toBe(false)
  })
})
