import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../models/card.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CardComponent {
  @Input() card!: Card;
  @Output() flip = new EventEmitter<number>();

  onCardClick(): void {
    if (!this.card.isFlipped && !this.card.isMatched) {
      this.flip.emit(this.card.id);
    }
  }
}
