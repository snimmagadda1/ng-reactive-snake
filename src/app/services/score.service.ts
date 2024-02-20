import { Injectable } from '@angular/core';
import { scan, startWith } from 'rxjs';
import { NavService, Point } from '.';
import {
  COLUMNS,
  FOOD_COUNT,
  ROWS,
  checkCollision,
  getEmptyPosition,
  getRandomNumber,
} from '../utils';

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
      food.push({
        x: getRandomNumber(0, COLUMNS - 1),
        y: getRandomNumber(0, ROWS - 1),
      });
    }

    return food;
  }

  eat(food: Point[], snake: Point[]): Point[] {
    let head = snake[0];

    for (let i = 0; i < food.length; i++) {
      if (checkCollision(food[i], head)) {
        food.splice(i, 1);
        return [...food, getEmptyPosition(snake)];
      }
    }

    return food;
  }
}
