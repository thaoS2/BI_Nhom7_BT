import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FashionDetailComponent } from './components/fashion-detail/fashion-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'detail/:id', component: FashionDetailComponent },
  { path: '**', redirectTo: '' }
];

