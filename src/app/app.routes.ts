import { Routes } from '@angular/router';
import { SpyrographComponent } from './spyrograph/spyrograph.component';

export const routes: Routes = [
  { path: '', redirectTo: 'spyrograph', pathMatch: 'full'},
  { path: 'spyrograph', loadComponent: () => SpyrographComponent}
];
