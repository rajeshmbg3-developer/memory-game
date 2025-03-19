import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { GameService } from '@services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-difficulty-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './difficulty-select.component.html',
  styleUrl: './difficulty-select.component.scss',
})
export class DifficultySelectComponent implements OnInit, OnDestroy {
  @Output() difficultySelected = new EventEmitter<'easy' | 'medium' | 'hard'>();
  @Output() startGame = new EventEmitter<void>();
  subscription!: Subscription;

  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.subscription = this.gameService.gameState$.subscribe((state) => {
      this.difficulty = state.difficulty;
    });
  }

  onDifficultyChange(difficulty: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = difficulty;
    this.difficultySelected.emit(difficulty);
  }

  onStartGame(): void {
    this.startGame.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
