import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Card, GameState } from '../models';
import { TimerService } from './timer.service';
import { CARD_IMAGES } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly CARD_IMAGES = CARD_IMAGES;

  private initialState: GameState = {
    cards: [],
    moves: 0,
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    gameCompleted: false,
    gameStarted: false,
    timer: 0,
    difficulty: 'easy',
  };

  private gameStateSubject = new BehaviorSubject<GameState>({
    ...this.initialState,
  });

  constructor(private timerService: TimerService) {
    this.timerService.timer$.subscribe((time) => {
      const currentState = this.gameStateSubject.value;
      this.gameStateSubject.next({
        ...currentState,
        timer: time,
      });
    });
  }

  get gameState$(): Observable<GameState> {
    return this.gameStateSubject.asObservable();
  }

  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      difficulty,
    });
  }

  startGame(): void {
    const difficulty = this.gameStateSubject.value.difficulty;
    const pairsCount = this.getPairsCountByDifficulty(difficulty);
    const cards = this.generateCards(pairsCount);

    this.gameStateSubject.next({
      ...this.initialState,
      cards,
      totalPairs: pairsCount,
      gameStarted: true,
      difficulty,
    });

    this.timerService.startTimer();
  }

  private getPairsCountByDifficulty(
    difficulty: 'easy' | 'medium' | 'hard'
  ): number {
    switch (difficulty) {
      case 'easy':
        return 8; // 16 cards
      case 'medium':
        return 12; // 24 cards
      case 'hard':
        return 20; // 40 cards
      default:
        return 8;
    }
  }

  private generateCards(pairsCount: number): Card[] {
    // Take subset of available images based on difficulty
    const selectedImages = this.CARD_IMAGES.slice(0, pairsCount);

    // Create pairs of cards
    let cards: Card[] = [];
    let id = 0;

    selectedImages.forEach((imageUrl) => {
      // Create two cards with the same image (a pair)
      cards.push({ id: id++, imageUrl, isFlipped: false, isMatched: false });
      cards.push({ id: id++, imageUrl, isFlipped: false, isMatched: false });
    });

    // Shuffle the cards
    return this.shuffleCards(cards);
  }

  private shuffleCards(cards: Card[]): Card[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  flipCard(cardId: number): void {
    const currentState = this.gameStateSubject.value;

    // Don't allow flipping if two cards are already flipped or the card is already matched
    const card = currentState.cards.find((c) => c.id === cardId);
    if (!card || card.isMatched || currentState.flippedCards.length >= 2) {
      return;
    }

    // Update the flipped state of the card
    const updatedCards = currentState.cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );

    // Add to flipped cards
    const flippedCards = [
      ...currentState.flippedCards,
      { ...card, isFlipped: true },
    ];

    // Check if we have two cards flipped
    if (flippedCards.length === 2) {
      this.gameStateSubject.next({
        ...currentState,
        cards: updatedCards,
        flippedCards,
        moves: currentState.moves + 1,
      });

      // Check for match after a short delay
      setTimeout(() => this.checkForMatch(), 800);
    } else {
      this.gameStateSubject.next({
        ...currentState,
        cards: updatedCards,
        flippedCards,
      });
    }
  }

  private checkForMatch(): void {
    const currentState = this.gameStateSubject.value;
    const [firstCard, secondCard] = currentState.flippedCards;

    let matchedPairs = currentState.matchedPairs;
    let gameCompleted = false;

    // Check if images match
    const isMatch = firstCard.imageUrl === secondCard.imageUrl;

    // Update cards based on match result
    const updatedCards = currentState.cards.map((card) => {
      if (isMatch && (card.id === firstCard.id || card.id === secondCard.id)) {
        return { ...card, isMatched: true };
      }
      if (!isMatch && (card.id === firstCard.id || card.id === secondCard.id)) {
        return { ...card, isFlipped: false };
      }
      return card;
    });

    // Update matched pairs count if there's a match
    if (isMatch) {
      matchedPairs += 1;
      gameCompleted = matchedPairs === currentState.totalPairs;

      // Stop timer if game is completed
      if (gameCompleted) {
        this.timerService.stopTimer();
      }
    }

    // Update game state
    this.gameStateSubject.next({
      ...currentState,
      cards: updatedCards,
      flippedCards: [],
      matchedPairs,
      gameCompleted,
    });
  }

  resetGame(): void {
    this.timerService.resetTimer();
    this.gameStateSubject.next({ ...this.initialState, difficulty: this.gameStateSubject.value.difficulty, });
  }

  resetToStartScreen(): void {
    this.timerService.resetTimer();
    this.gameStateSubject.next({
      ...this.initialState,
      // Keep the previously selected difficulty as the default
      difficulty: this.gameStateSubject.value.difficulty,
    });
  }
}
