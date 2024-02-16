import { Routes } from '@angular/router';
import { GameComponent } from './components';

export const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: GameComponent },
];
