import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private _score$ = new BehaviorSubject<number>(0);

  public get score$() {
    return this._score$.asObservable();
  }

  public incrementScore() {
    this._score$.next(this._score$.value + 1);
  }

  constructor() {}
}
