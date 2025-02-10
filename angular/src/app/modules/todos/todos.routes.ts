import { Routes } from '@angular/router'
import { TodosComponent } from './todos.component'
 
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: TodosComponent
  }
]
