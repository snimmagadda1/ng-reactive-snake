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
  animationFrameScheduler,
  combineLatest,
  distinctUntilChanged,
  filter,
  interval,
  map,
  scan,
  share,
  skip,
  take,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  checkCollision,
  getRandomPoint,
  paintCell,
  wrapBounds,
} from '../utils/point';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  providers: [NavService, SnakeService, ScoreService],
  styleUrl: './game.component.scss',
  template: `
    <div>
      <h1>Score: {{ scoreService.score$ | async }}</h1>
      <button (click)="togglePause()">Start</button>
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
  paused = false;

  togglePause() {
    this.paused = !this.paused;
  }

  constructor(
    private navService: NavService,
    public scoreService: ScoreService,
    private snakeService: SnakeService
  ) {
    // game clock publisher
    const ticks$ = interval(300);

    // snake publisher
    // tick -> [direction, snakeLength] -> move(snake, [direction, snakeLength]) -> snake[{}, ... {}]
    const snake$ = ticks$.pipe(
      // take(10),
      filter(() => !this.paused),
      withLatestFrom(this.navService.direction$, this.navService.snakeLength$),
      map(([_, direction, snakeLength]) => [direction, snakeLength]),
      scan(this.navService.move, this.snakeService.initSnake()),
      share()
    );

    // food publisher
    const food$ = snake$.pipe(
      scan(this.snakeService.eat, this.scoreService.initFood()),
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

    // render loop, 60 fps
    interval(1000 / FPS, animationFrameScheduler)
      .pipe(
        withLatestFrom(scene$),
        map(([, scene]) => scene)
        // takeWhile(scene => !isGameOver(scene))
      )
      .subscribe({
        next: scene => this.renderScene(this.context, scene),
        // complete: () => this.renderGameOver(this.context),
      });
  }

  renderScene(ctx: CanvasRenderingContext2D, scene: [Point[], Point[]]) {
    console.log(`Snake: ${JSON.stringify(scene[0])}`);
    // renderBackground(ctx);
    // renderScore(ctx, scene.score);
    this.renderApples(ctx, scene[1]);
    this._clearCanvas(ctx);
    this.renderSnake(ctx, scene[0]);
  }

  renderApples(ctx: CanvasRenderingContext2D, apples: any[]) {
    apples.forEach(apple => paintCell(ctx, apple, 'red'));
  }

  renderSnake(ctx: CanvasRenderingContext2D, snake: Point[]) {
    snake.forEach((segment, index) =>
      paintCell(ctx, wrapBounds(segment), this._getSegmentColor(index))
    );
  }

  _clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(
      0,
      0,
      this.board.nativeElement.width,
      this.board.nativeElement.height
    );
  }

  _getSegmentColor(index: number) {
    return index === 0 ? 'black' : '#2196f3';
  }

  ngAfterViewInit(): void {
    this.context = this.board.nativeElement.getContext('2d')!;
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
