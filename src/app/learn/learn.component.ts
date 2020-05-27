import { Component, OnInit } from '@angular/core';
import {HotkeyRecorderService, PersistenceService} from '../core/services';
import {map, first, filter, tap} from 'rxjs/operators';
import {combineLatest, BehaviorSubject, Observable, of} from 'rxjs';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {

  currentFlashcardIndex$ = new BehaviorSubject<number>(0);
  hasCardToLearn$ = combineLatest([this.currentFlashcardIndex$, this.persistenceService.getFlashcardsToBeRepeated()]).pipe(
    map(([index, flashcards]) => flashcards.length > 0 && flashcards.length > index),
  );

  currentFlashcard$ =  combineLatest([this.currentFlashcardIndex$, this.persistenceService.getFlashcardsToBeRepeated()]).pipe(
    map(([index, flashcards]) => flashcards[index])
  );
  question$ = this.currentFlashcard$.pipe(
    filter(f => !!f),
    map(f => f.shortcutLabel),
  );
  answer$ = this.currentFlashcard$.pipe(
    filter(f => !!f),
    map(f => f.shortcutKeys.join('+'))
  );
  correctShortcutDetected$ = combineLatest([this.hotkeyRecorderService.hotkey$, this.answer$]).pipe(
    map(([keyPressed, expected]) => {

      console.log(keyPressed, expected)
      return keyPressed.join('+')==expected;
    }),
    tap((value) => console.log('correct shortcut detected', value))
  );
  _showAnswer = false;

  constructor(readonly persistenceService: PersistenceService, private hotkeyRecorderService: HotkeyRecorderService,
  ) { }

  ngOnInit(): void {
  }

  showAnswer() {
    this._showAnswer = !this._showAnswer;

  }

  next(grade: number) {
    this._showAnswer = false;
    this.persistenceService.getFlashcardsToBeRepeated().pipe(
      first(),
      map(flashcards => flashcards.length > this.currentFlashcardIndex$.value)
    ).subscribe((hasNext) => {
      this.currentFlashcard$.pipe(first()).subscribe((flashcard) => {
        // 0 is a unknown score
        this.persistenceService.updateFlashcardStats(flashcard.id, grade);
      });
      if (hasNext) {
        this.currentFlashcardIndex$.next(this.currentFlashcardIndex$.value+1);
      }
    });
  }
}
