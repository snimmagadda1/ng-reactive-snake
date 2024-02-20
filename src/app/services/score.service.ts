import { Injectable } from '@angular/core';
import { scan, startWith } from 'rxjs';
import { NavService, Point } from '.';
import { FOOD_COUNT } from '../components/utils/constants';
import { getRandomPoint } from '../components/utils/point';

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

  initFood(): Point[] {
    const food = [];

    for (let i = 0; i < FOOD_COUNT; i++) {
      food.push(getRandomPoint());
    }

    return food;
  }
}
