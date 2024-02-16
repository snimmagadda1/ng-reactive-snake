import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavService, ScoreService } from '../../services';
import { CommonModule } from '@angular/common';
import { Subscription, interval, tap } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  providers: [NavService, ScoreService],
  styleUrl: './game.component.scss',
  template: `
    <div>
      <h1>Score: {{ scoreService.score$ | async }}</h1>
      <button (click)="placeFood()">Place Food</button>
    </div>
    <canvas
      #board
      [width]="COLUMNS * (CELL_SIZE + GAP_SIZE)"
      [height]="ROWS * (CELL_SIZE + GAP_SIZE)"></canvas>
  `,
})
export class GameComponent implements AfterViewInit {
  public readonly COLUMNS = 50;
  public readonly ROWS = 50;
  public readonly CELL_SIZE = 10;
  public readonly GAP_SIZE = 1;

  @ViewChild('board') board!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  private subscription: Subscription = new Subscription();

  constructor(
    public scoreService: ScoreService,
    private navService: NavService
  ) {
    this.subscription.add(
      this.navService.listen$().subscribe(val => console.log(val))
    );

    this.subscription.add(
      interval(300)
        .pipe(tap(() => console.log('tick')))
        .subscribe()
    );
  }

  ngAfterViewInit(): void {
    this.context = this.board.nativeElement.getContext('2d')!;
    this.context.fillStyle = 'red';
    // interval(1000)
    //   .pipe(tap(() => this.placeFood()))
    //   .subscribe();
  }

  placeFood(): void {
    const x =
      Math.floor(Math.random() * this.COLUMNS) *
      (this.CELL_SIZE + this.GAP_SIZE);
    const y =
      Math.floor(Math.random() * this.ROWS) * (this.CELL_SIZE + this.GAP_SIZE);
    this.context.fillStyle = 'green';
    this.context.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
  }

  placeFoodAtPoint(x: number, y: number): void {
    this.context.fillStyle = 'green';
    this.context.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
  }
}
