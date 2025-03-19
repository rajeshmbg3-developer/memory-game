import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState } from '../../models';
import { GameService } from '../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent {
  @Output() playAgain = new EventEmitter<void>();
  @Output() newGame = new EventEmitter<void>();
  gameState$!: Observable<GameState>;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameState$ = this.gameService.gameState$;
  }

  onPlayAgain(): void {
    this.playAgain.emit();
  }

  onNewGame(): void {
    this.newGame.emit();
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
}
