import { Routes } from '@angular/router'
import { SearchPageComponent } from './pages/search-page/search-page.component'
import { RepoListComponent } from './pages/repo-list/repo-list.component'

export const routes: Routes = [
  {
    path: 'search',
    component: SearchPageComponent,
    title: 'Busca de Usuários - GitHub'
  },
  {
    path: 'user/:username/repos',
    component: RepoListComponent,
    title: 'Repositórios - GitHub'
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'search'
  }
]