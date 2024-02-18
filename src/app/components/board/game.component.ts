import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NavService, Point, ScoreService, SnakeService } from '../../services';
import { CommonModule } from '@angular/common';
import {
  COLUMNS,
  ROWS,
  CELL_SIZE,
  GAP_SIZE,
  FOOD_COUNT,
  FPS,
} from '../utils/constants';

import {
  Subscription,
  animationFrame,
  combineLatest,
  distinctUntilChanged,
  interval,
  map,
  scan,
  share,
  skip,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs';
import { checkCollision, getRandomPoint } from '../utils/point';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  providers: [NavService, SnakeService, ScoreService],
  styleUrl: './game.component.scss',
  template: `
    <div>
      <h1>Score: {{ scoreService.score$ | async }}</h1>
    </div>
    <canvas
      #board
      [width]="COLUMNS * (CELL_SIZE + GAP_SIZE)"
      [height]="ROWS * (CELL_SIZE + GAP_SIZE)"></canvas>
  `,
})
export class GameComponent implements AfterViewInit {
  @ViewChild('board') board!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  private subscription: Subscription = new Subscription();

  constructor(
    private navService: NavService,
    public scoreService: ScoreService,
    private snakeService: SnakeService
  ) {
    // game clock publisher
    const ticks$ = interval(500);

    // snake publisher
    // tick -> [direction, snakeLength] -> move(snake, [direction, snakeLength]) -> snake[{}, ... {}]
    const snake$ = ticks$.pipe(
      withLatestFrom(this.navService.direction$, this.navService.snakeLength$),
      map(([_, direction, snakeLength]) => [direction, snakeLength]),
      scan(this.navService.move, this.snakeService.initSnake()),
      share()
    );

    // food publisher
    const food$ = snake$.pipe(
      scan(this.snakeService.eat, this.initFood()),
      distinctUntilChanged(),
      share()
    );

    // food score publisher (notifier for other streams)
    this.subscription.add(
      food$
        .pipe(
          skip(1),
          tap(() => this.scoreService.incrementScore())
        )
        .subscribe()
    );

    const scene$ = combineLatest([snake$, food$]);

    /**
     * This stream takes care of rendering the game while maintaining 60 FPS
     */
    interval(1000 / FPS, animationFrame)
      .pipe(
        withLatestFrom(scene$, (_, scene) => scene)
        // takeWhile(scene => !isGameOver(scene))
      )
      .subscribe({
        next: scene => this.renderScene(this.context, scene),
        // complete: () => this.renderGameOver(this.context),
      });
  }

  renderScene(ctx: CanvasRenderingContext2D, scene: any) {
    console.log(scene);
    // renderBackground(ctx);
    // renderScore(ctx, scene.score);
    this.renderApples(ctx, scene[1]);
    this.renderSnake(ctx, scene[0]);
  }

  renderApples(ctx: CanvasRenderingContext2D, apples: any[]) {
    apples.forEach(apple => this.paintCell(ctx, apple, 'red'));
  }

  renderSnake(ctx: CanvasRenderingContext2D, snake: Point[]) {
    snake.forEach((segment, index) =>
      this.paintCell(ctx, this.wrapBounds(segment), this.getSegmentColor(index))
    );
  }

  getSegmentColor(index: number) {
    return index === 0 ? 'black' : '#2196f3';
  }

  paintCell(ctx: CanvasRenderingContext2D, point: Point, color: string) {
    const x = point.x * CELL_SIZE + point.x * GAP_SIZE;
    const y = point.y * CELL_SIZE + point.y * GAP_SIZE;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  }

  wrapBounds(point: Point) {
    point.x = point.x >= COLUMNS ? 0 : point.x < 0 ? COLUMNS - 1 : point.x;
    point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

    return point;
  }

  ngAfterViewInit(): void {
    this.context = this.board.nativeElement.getContext('2d')!;
  }

  initFood(): Point[] {
    const food = [];

    for (let i = 0; i < FOOD_COUNT; i++) {
      food.push(getRandomPoint());
    }

    return food;
  }

  get COLUMNS() {
    return COLUMNS;
  }

  get ROWS() {
    return ROWS;
  }

  get FOOD_COUNT() {
    return FOOD_COUNT;
  }

  get CELL_SIZE() {
    return CELL_SIZE;
  }

  get GAP_SIZE() {
    return GAP_SIZE;
  }
}
