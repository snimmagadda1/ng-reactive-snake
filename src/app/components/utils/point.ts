import { Point } from '../../services';
import { CELL_SIZE, COLUMNS, GAP_SIZE, ROWS } from './constants';

export function checkCollision(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export function getRandomPoint(): Point {
  const x = Math.floor(Math.random() * COLUMNS) * (CELL_SIZE + GAP_SIZE);
  const y = Math.floor(Math.random() * ROWS) * (CELL_SIZE + GAP_SIZE);

  return { x, y };
}

export function isEmptyCell(position: Point, snake: Point[]): boolean {
  return !snake.some(segment => checkCollision(segment, position));
}
