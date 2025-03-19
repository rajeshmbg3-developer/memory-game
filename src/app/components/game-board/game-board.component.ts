import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState } from '../../models';
import { GameService } from '../../services';
import { CommonModule } from '@angular/common';
import { DifficultySelectComponent } from '../difficulty-select/difficulty-select.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { CardComponent } from '../card/card.component';
import { GameOverComponent } from '../game-over/game-over.component';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [
    CommonModule,
    DifficultySelectComponent,
    ScoreboardComponent,
    CardComponent,
    GameOverComponent,
  ],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss',
})
export class GameBoardComponent {
  gameState$!: Observable<GameState>;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameState$ = this.gameService.gameState$;
  }

  onCardFlip(cardId: number): void {
    this.gameService.flipCard(cardId);
  }

  onSetDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.gameService.setDifficulty(difficulty);
  }

  onStartGame(): void {
    this.gameService.startGame();
  }

  onPlayAgain(): void {
    this.gameService.resetGame();
  }

  getGridClass(totalCards: number): string {
    if (totalCards <= 16) return 'grid-4x4';
    if (totalCards <= 24) return 'grid-4x6';
    return 'grid-5x8';
  }
  onRestartGame(): void {
    this.gameService.resetGame();
    this.gameService.startGame(); // Immediately start a new game
  }
  onNewGame(): void {
    this.gameService.resetToStartScreen();
  }
}
