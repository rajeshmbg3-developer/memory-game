import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-difficulty-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './difficulty-select.component.html',
  styleUrl: './difficulty-select.component.scss',
})
export class DifficultySelectComponent {
  @Output() difficultySelected = new EventEmitter<'easy' | 'medium' | 'hard'>();
  @Output() startGame = new EventEmitter<void>();

  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  onDifficultyChange(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = difficulty;
    this.difficultySelected.emit(difficulty);
  }

  onStartGame(): void {
    this.startGame.emit();
  }
}
