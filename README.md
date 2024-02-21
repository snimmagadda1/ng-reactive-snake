# ng Reactive Snakes

The classic game of snake! Built using reactive programming & angular:

![Snake game gif](./snake.gif)

## Why build this?

This is an exercise in thinking & programming reactively. The intent here is not to make a beautiful game, but rather expose the internals of how something like this can be built. This is a version of [this approach](https://blog.thoughtram.io/rxjs/2017/08/24/taming-snakes-with-reactive-streams.html) using modern RxJS

## About the build

The game is driven by only a handful of source streams:

| Source stream | Function | Code |
|----------|----------|----------|
| `tick$` | game clock interval that dictate snake pace | `interval(100)`  |
| `direction$` | mapped output from KeyboardEvent listener | `fromEvent(document, 'keydown').pipe(startWith({ keyCode: 39 }),map(event => DIRECTIONS[(event as KeyboardEvent).keyCode]),filter(direction => !!direction),startWith(DIRECTIONS[37]),distinctUntilChanged());`  |
| `snakeLength$` | accumulator to track the length of the snake | `this._length$.asObservable().pipe(scan((acc, length) => length + acc),share())`  |

## Getting started

The simplest way to run is simply clone, install deps, & start up the angular dev server:

```bash
git clone https://github.com/snimmagadda1/ng-reactive-snake.git
cd ng-reactive-snake
npm install 
npm run start
```

You will be able to play the game and monitor key streams.
