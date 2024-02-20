import { Injectable } from '@angular/core';
import { BehaviorSubject, scan, share } from 'rxjs';
import { Point } from '.';

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

  // Publisher to push changes to snake length
  get snakeLength$() {
    return this._length$.asObservable().pipe(
      scan((acc, length) => length + acc),
      share()
    );
  }
}
