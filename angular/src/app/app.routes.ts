import { Routes } from '@angular/router'
import { NotFoundComponent } from './modules/pages/404/404.component'
import { LayoutComponent } from './layouts/layouts/layouts.component'

export const routes: Routes = [
  {
    path: 'popup',
    loadChildren: () => import('./modules/popup/popup.routes').then((c) => c.routes)
  },
  {
    path: 'side-panel',
    loadChildren: () => import('./modules/side-panel/side-panel.routes').then((c) => c.routes)
  },
  { path: '**', redirectTo: 'tab', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'tab',
        loadChildren: () => import('./modules/home/tab.routes') ,
      }
    ],
  },
]
