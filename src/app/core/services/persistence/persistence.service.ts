import { Injectable } from "@angular/core";
import { ElectronService } from "../electron/electron.service";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface FlashCardStats {
  repetition: number;
  interval: number;
  easinessFactor: number;
  previousTimestampInSeconds: number;
  nextTimestampInSeconds: number;
}

export interface FlashCard {
  id: number;
  shortcutLabel: string; // The label/question associated to this shortcut
  shortcutKeys: string[]; // string-serialized shortcut (e.g. Ctrl+a)

  stats: FlashCardStats; // stats used to schedule next repetition
}

@Injectable({
  providedIn: "root"
})
export class PersistenceService {
  private flashcards$ = new BehaviorSubject<FlashCard[]>([]);

  constructor(private electronService: ElectronService) {
    this.flashcards$.next(this.getAllFlashcardsSync());
  }

  getAllFlashcard(): Observable<FlashCard[]> {
    return this.flashcards$.asObservable();
  }

  private getAllFlashcardsSync(): FlashCard[] {
    try {
      const fileName =
        this.electronService.remote.app.getPath('userData') + "/db.json";
      const data = this.electronService.fs.readFileSync(fileName, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.log("file does not exist");
      return [];
    }
  }

  getFlashcardsToBeRepeated(): Observable<FlashCard[]> {
    return this.flashcards$.pipe(
      map(filterRepeatableFlashcards)
    );
  }

  addFlashcard(shortcutLabel: string, shortcutKeys: string[]): void {
    const data = this.createNewFlashCard(shortcutLabel, shortcutKeys);
    const currentValues = this.flashcards$.getValue();
    currentValues.push(data);
    this.flushFlashcardsToDisk();
    this.flashcards$.next(currentValues);
  }

  updateFlashcardStats(id: number, grade: number): void {
    const toModify = this.flashcards$.value.find(f => f.id == id);
    const ts = Math.round(new Date().getTime() / 1000);
    toModify.stats = gradeFlashCard(toModify.stats, grade, ts);
    this.flushFlashcardsToDisk(); // TODO: extremely inefficient, use real db (SQLite)
    this.flashcards$.next(this.flashcards$.value);
  }

  private flushFlashcardsToDisk(): void {
    const fileName = this.electronService.remote.app.getPath('userData') + "/db.json";
    const writeStream = this.electronService.fs.createWriteStream(fileName, {
      flags: "w+"
    });

    const data = JSON.stringify(this.flashcards$.value);
    writeStream.write(data);
  }

  private createNewFlashCard(
    shortcutLabel: string,
    shortcutKeys: string[]
  ): FlashCard {
    return {
      id: this.flashcards$.value.length + 1,
      shortcutLabel,
      shortcutKeys,
      stats: {
        repetition: 0,
        interval: 1,
        easinessFactor: 2.5,
        previousTimestampInSeconds: 0,
        nextTimestampInSeconds: 0
      }
    };
  }
}

const filterRepeatableFlashcards = (
  flashcards: FlashCard[]
): FlashCard[] => {
  if (!flashcards) {
    return [];
  }

  const currentTimestampInSeconds = Math.round(new Date().getTime() / 1000);
  return flashcards.filter(
    f => f.stats.nextTimestampInSeconds <= currentTimestampInSeconds
  );
};

// Supermemo 2 algorithms, adapted from https://github.com/walterscarborough/LibSpacey/blob/master/common/src/flashcardGrader.cpp
const gradeFlashCard = (
  flashcard: FlashCardStats,
  grade: number,
  currentUnixTimestamp: number
): FlashCardStats => {
  let newInterval = 0;
  let newRepetition = 0;
  if (grade >= 3) {
    switch (flashcard.repetition) {
      case 0:
        newInterval = 1;
        newRepetition = 1;
        break;
      case 1:
        newInterval = 6;
        newRepetition = 2;
        break;
      default:
        newInterval = Math.round(
          (flashcard.interval - 1) * flashcard.easinessFactor
        );

        newRepetition = flashcard.repetition + 1;
        break;
    }
  } else {
    newInterval = 1;
    newRepetition = 0;
  }

  const newEasinessFactor = Math.max(
    1.3,
    flashcard.easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  );

  const seconds = 60;
  const minutes = 60;
  const hours = 24;
  const dayMultiplier = seconds * minutes * hours;
  const extraDays = dayMultiplier * flashcard.interval;
  const newNextDatetime = currentUnixTimestamp + extraDays;

  return {
    interval: newInterval,
    repetition: newRepetition,
    easinessFactor: newEasinessFactor,
    previousTimestampInSeconds: flashcard.nextTimestampInSeconds,
    nextTimestampInSeconds: newNextDatetime
  };
};
