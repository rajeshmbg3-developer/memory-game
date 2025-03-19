import { Card } from './card.model';

export interface GameState {
  cards: Card[];
  moves: number;
  flippedCards: Card[];
  matchedPairs: number;
  totalPairs: number;
  gameCompleted: boolean;
  gameStarted: boolean;
  timer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
