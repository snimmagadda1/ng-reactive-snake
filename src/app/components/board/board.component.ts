import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  styleUrl: './board.component.scss',
  template: `
    <div>
      <h1>Board Component</h1>
      <p>This is an inline template</p>
    </div>
    <canvas
      #board
      [width]="COLUMNS * (CELL_SIZE + GAP_SIZE)"
      [height]="ROWS * (CELL_SIZE + GAP_SIZE)"></canvas>
  `,
})
export class BoardComponent implements AfterViewInit {
  public readonly COLUMNS = 50;
  public readonly ROWS = 50;
  public readonly CELL_SIZE = 10;
  public readonly GAP_SIZE = 1;

  @ViewChild('board') board!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.context = this.board.nativeElement.getContext('2d')!;
    this.context.fillStyle = 'red';
    this.context.fillRect(20, 20, 100, 100);
  }
}
