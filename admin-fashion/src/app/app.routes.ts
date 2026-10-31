import { Routes } from '@angular/router';
import { FashionListComponent } from './components/fashion-list/fashion-list.component';
import { FashionFormComponent } from './components/fashion-form/fashion-form.component';
import { FashionDetailComponent } from './components/fashion-detail/fashion-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/list', pathMatch: 'full' },
  { path: 'admin/list', component: FashionListComponent },
  { path: 'admin/add', component: FashionFormComponent },
  { path: 'admin/edit/:id', component: FashionFormComponent },
  { path: 'admin/detail/:id', component: FashionDetailComponent },
  { path: '**', redirectTo: '/admin/list' }
];
