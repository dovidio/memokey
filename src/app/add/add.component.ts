import {Component, OnInit, ViewChild} from "@angular/core";
import {FlashCard, PersistenceService} from "../core/services";
import {HotkeyRecorderService, HotkeyService} from "../core/services/hotkeys";
import {DtToast} from "@dynatrace/barista-components/toast";
import {Observable} from "rxjs";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})
export class AddComponent implements OnInit {
  @ViewChild("shortcutLabel") shortcutLabel;

  isShortcutDetectionRunning = false;
  detectedShortcut: string[] = null;
  question: string;

  shortcuts$: Observable<FlashCard[]>;

  constructor(
      private persistenceService: PersistenceService,
      private hotkeyRecorderService: HotkeyRecorderService,
      private hotkeyService: HotkeyService,
      private toast: DtToast
  ) {}

  ngOnInit(): void {
    this.hotkeyRecorderService.hotkey$.subscribe((keys) => {
      if(this.isShortcutDetectionRunning) {
        this.detectedShortcut = keys;
        this.isShortcutDetectionRunning = false;
      }
    });
    this.shortcuts$ = this.persistenceService.getAllFlashcard();
  }

  saveShortcut(): void {
    if(this.validateShortcut() && this.validateQuestion()) {
      this.persistenceService.addFlashcard(this.question, this.detectedShortcut);
      this.clearInputs();
      this.toast.create("Successfully created flashcard!");
    }
  }

  clearInputs(): void {
    this.detectedShortcut = null;
    this.question = "";
  }

  startShortcutDetection() {
    if (!this.isShortcutDetectionRunning) {
      this.isShortcutDetectionRunning = true;
    }
  }

  validateQuestion() {
    return this.question != null && this.question.length > 0;
  }

  validateShortcut() {
    return this.detectedShortcut != null && this.detectedShortcut.length > 0;
  }
}
