import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

export interface FlashCardStats {
    repetition: number,
    interval: number,
    easinessFactor: number,
    previousTimestampInSeconds: number,
    nextTimestampInSeconds: number
}

export interface FlashCard {
    shortcutLabel: string; // The label/question associated to this shortcut
    shortcutString: string; // string-serialized shortcut (e.g. Ctrl+a)

    stats: FlashCardStats; // stats used to schedule next repetition
}

@Injectable({
  providedIn: "root"
})
export class PersistenceService {

    flashcards: FlashCard[];

    constructor(private electronService: ElectronService) {
        this.flashcards = this.getAllFlashcards();
    }

    getAllFlashcards(): FlashCard[] {
        try {
            console.log(this.electronService.remote.app.getAppPath());
            const fileName = this.electronService.remote.app.getAppPath() + '/db.json';
            const data = this.electronService.fs.readFileSync(fileName, 'utf8');
    
            console.log(data);
            return JSON.parse(data);
        } catch(err) {
            console.log('file does not exist');
            return [];
        }
    }

    getShortcutsToBeRepeated(currentTimestampInSeconds: number): FlashCard[] {
        return this.flashcards
            .filter(f => f.stats.nextTimestampInSeconds <= currentTimestampInSeconds);
    }

    addShortcut(shortcutLabel: string, shortcut: string) {
        const data = this.createNewFlashCard(shortcutLabel, shortcut);
        this.flashcards.push(data);
        this.flushFlashcardsToDisk(); // TODO: extremely inefficient, use real db (SQLite)
    }

    updateFlashcardStats(index: number, grade: number) {
        const toModify = this.flashcards[index];
        const ts = Math.round((new Date()).getTime() / 1000);
        toModify.stats = gradeFlashCard(toModify.stats, grade, ts);
        this.flushFlashcardsToDisk(); // TODO: extremely inefficient, use real db (SQLite)
    }

    private flushFlashcardsToDisk() {
        console.log(this.electronService.remote.app.getAppPath());
        const fileName = this.electronService.remote.app.getAppPath() + '/db.json';
        const writeStream = this.electronService.fs.createWriteStream(fileName, {flags: 'w+'});

        const data = JSON.stringify(this.flashcards);
        writeStream.write(data, () => {
            console.log('written');
        });
    }

    private createNewFlashCard(shortcutLabel: string, shortcutString: string): FlashCard {
        // TODO: check appropriate default values
        return {
            shortcutLabel,
            shortcutString,
            stats: {
                repetition: 0,
                interval: 0,
                easinessFactor: 0,
                previousTimestampInSeconds: 0,
                nextTimestampInSeconds: 0
            }
        }
    }
}

const gradeFlashCard = (
    flashcard: FlashCardStats,
    grade: number,
    currentUnixTimestamp: number
  ): FlashCardStats  => {

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
        nextTimestampInSeconds: newNextDatetime,
    }
  }