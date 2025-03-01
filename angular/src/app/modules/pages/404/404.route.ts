import { Routes } from '@angular/router'
import { NotFoundComponent } from './404.component'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NotFoundComponent
  }
]
