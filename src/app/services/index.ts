import { NavService } from './nav.service';
import { ScoreService } from './score.service';
import { SnakeService } from './snake.service';

export const services = [NavService, SnakeService, ScoreService];

export * from './nav.service';
export * from './score.service';
export * from './snake.service';
