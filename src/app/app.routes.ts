import { Routes } from '@angular/router';
import { BoardComponent } from './components';

export const routes: Routes = [
    { path: '', redirectTo: 'board', pathMatch: 'full' },
    { path: 'board', component: BoardComponent},
];
