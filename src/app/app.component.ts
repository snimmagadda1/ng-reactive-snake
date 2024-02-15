import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  styleUrl: './app.component.scss',
  template: `
    <router-outlet/>
  `
})
export class AppComponent {
  title = 'ng-reactive-snakes';
}
