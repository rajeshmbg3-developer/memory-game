import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timerSubject = new BehaviorSubject<number>(0);
  private timerSubscription: Subscription | null = null;

  get timer$(): Observable<number> {
    return this.timerSubject.asObservable();
  }

  startTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubject.next(0);
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timerSubject.next(this.timerSubject.value + 1);
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  resetTimer(): void {
    this.stopTimer();
    this.timerSubject.next(0);
  }
}
