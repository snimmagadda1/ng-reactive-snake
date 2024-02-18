import { Injectable } from '@angular/core';
import { scan, startWith } from 'rxjs';
import { NavService } from '.';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor(private navService: NavService) {}

  // Score increments by 1 for every snakeLength$ emitted
  public get score$() {
    return this.navService.snakeLength$.pipe(
      startWith(0),
      scan((score, _) => score + 1)
    );
  }

  incrementScore() {
    this.navService.length$ = 1;
  }
}
