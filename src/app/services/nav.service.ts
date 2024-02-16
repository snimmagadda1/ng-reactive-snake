import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  constructor() {}

  public listen$() {
    return fromEvent(document, 'keydown');
  }
}
