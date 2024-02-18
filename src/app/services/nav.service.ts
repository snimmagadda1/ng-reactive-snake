import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  scan,
  share,
  startWith,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  _length$ = new BehaviorSubject<number>(5);

  constructor() {}

  // listen to keydown events and map to direction
  get direction$() {
    return fromEvent(document, 'keydown').pipe(
      map(event => DIRECTIONS[(event as KeyboardEvent).keyCode]),
      filter(direction => !!direction),
      startWith(DIRECTIONS[37]),
      distinctUntilChanged()
    );
  }

  get snakeLength$() {
    return this._length$.asObservable().pipe(
      scan((acc, length) => length + acc),
      share()
    );
  }

  set length$(length: number) {
    this._length$.next(length);
  }

  move(snake: Point[], [direction, snakeLength]: any) {
    let newX = snake[0].x;
    let newY = snake[0].y;

    newX += 1 * direction.x;
    newY += 1 * direction.y;

    let tail;

    if (snakeLength > snake.length) {
      tail = { x: newX, y: newY };
    } else {
      tail = snake.pop()!;
      tail.x = newX;
      tail.y = newY;
    }

    snake.unshift(tail);
    return snake;
  }
}

export interface Point {
  x: number;
  y: number;
}

export interface Directions {
  [key: number]: Point;
}

// keycodes
export const DIRECTIONS: Directions = {
  37: { x: -1, y: 0 }, // l
  38: { x: 0, y: -1 }, // u
  39: { x: 1, y: 0 }, // r
  40: { x: 0, y: 1 }, // d
};
