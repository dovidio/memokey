import {Inject, Injectable} from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { buffer, filter, map } from "rxjs/operators";
import {DOCUMENT} from "@angular/common";

@Injectable({ providedIn: "root" })
export class HotkeyRecorderService {
  hotkey$: Observable<string[]>;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const keyDown$ = fromEvent<KeyboardEvent>(document, "keydown");
    const keyUp$ = fromEvent<KeyboardEvent>(document, "keyup");

    this.hotkey$ = keyDown$.pipe(
      map((keyEvent) => keyEvent.key),
      buffer(keyUp$),
      filterEmpty(),
      filterDuplicates(),
    );
  }
}

const filterEmpty = <T>() => filter((arr: T[]) => arr.length > 0);
const filterDuplicates = <T>() => map((arr: T[]) => Array.from(new Set(arr)));
