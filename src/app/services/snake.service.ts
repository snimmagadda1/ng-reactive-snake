import { Injectable } from '@angular/core';
import { BehaviorSubject, scan, share } from 'rxjs';
import { Point } from '.';
import { checkCollision, isEmptyCell } from '../components/utils/point';
import { getRandomNumber } from '../components/utils/number';
import { COLUMNS, ROWS } from '../components/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class SnakeService {
  public SNAKE_INIT_LENGTH = 5;
  _length$ = new BehaviorSubject<number>(this.SNAKE_INIT_LENGTH);

  constructor() {}

  initSnake() {
    const snake: Point[] = [];
    for (let i = this.SNAKE_INIT_LENGTH - 1; i >= 0; i--) {
      snake.push({ x: i, y: 0 });
    }

    return snake;
  }

  eat(food: Point[], snake: Point[]): Point[] {
    let head = snake[0];

    for (let i = 0; i < food.length; i++) {
      if (checkCollision(food[i], head)) {
        food.splice(i, 1);
        return [...food, this._getEmptyPosition(snake)];
      }
    }

    return food;
  }

  _getEmptyPosition(snake: Point[] = []): Point {
    let position = {
      x: getRandomNumber(0, COLUMNS - 1),
      y: getRandomNumber(0, ROWS - 1),
    };

    if (isEmptyCell(position, snake)) {
      return position;
    }

    return this._getEmptyPosition(snake);
  }

  // Publisher to push changes to snake length
  get snakeLength$() {
    return this._length$.asObservable().pipe(
      scan((acc, length) => length + acc),
      share()
    );
  }
}
