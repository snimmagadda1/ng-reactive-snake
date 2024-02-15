import { Component, ElementRef, ViewChild } from '@angular/core';

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
    <canvas #board></canvas>
  `,
})
export class BoardComponent {
  public readonly COLUMNS = 50;
  public readonly ROWs = 50;

  public readonly CELL_SIZE = 10;
  public readonly GAP_SIZE = 1;

  @ViewChild('board', { static: true }) board!: ElementRef;
}
