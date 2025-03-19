import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { GameState } from '../../models';
import { GameService } from '../../services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss',
})
export class ScoreboardComponent {
  gameState$!: Observable<GameState>;
  @Output() restart = new EventEmitter<void>();
  @Output() newGame = new EventEmitter<void>();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameState$ = this.gameService.gameState$;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  onNewGame(): void {
    if (
      confirm(
        'Are you sure you want to return to difficulty selection?\nYour current progress will be lost.'
      )
    ) {
      this.newGame.emit();
    }
  }

  onRestartGame(): void {
    if (
      confirm(
        'Are you sure you want to restart the game?\nYour current progress will be lost.'
      )
    ) {
      this.restart.emit();
    }
  }
}
