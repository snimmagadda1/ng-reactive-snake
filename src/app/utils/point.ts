import { Point } from '../services';
import { CELL_SIZE, COLUMNS, GAP_SIZE, ROWS } from './constants';
import { getRandomNumber } from './number';

export function checkCollision(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export function getEmptyPosition(snake: Point[] = []): Point {
  let position = {
    x: getRandomNumber(0, COLUMNS - 1),
    y: getRandomNumber(0, ROWS - 1),
  };

  if (isEmptyCell(position, snake)) {
    return position;
  }

  return getEmptyPosition(snake);
}

export function isEmptyCell(position: Point, snake: Point[]): boolean {
  return !snake.some(segment => checkCollision(segment, position));
}

export function wrapBounds(point: Point) {
  point.x = point.x >= COLUMNS ? 0 : point.x < 0 ? COLUMNS - 1 : point.x;
  point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

  return point;
}

export function paintCell(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string
) {
  const x = point.x * CELL_SIZE + point.x * GAP_SIZE;
  const y = point.y * CELL_SIZE + point.y * GAP_SIZE;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}
