import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FlashCard, PersistenceService} from "../core/services";
import {HotkeyRecorderService} from "../core/services/hotkeys";
import {DtToast} from "@dynatrace/barista-components/toast";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {DtSort, DtTableDataSource, DtTableSearch} from "@dynatrace/barista-components/table";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})
export class AddComponent implements OnInit, OnDestroy {
  @ViewChild("shortcutLabel") shortcutLabel;
  @ViewChild(DtSort, {static: true}) sortable: DtSort;
  @ViewChild(DtTableSearch, { static: true })
  tableSearch: DtTableSearch;

  isShortcutDetectionRunning = false;
  detectedShortcut: string[] = null;
  question: string;

  dataSource: DtTableDataSource<FlashCard> = new DtTableDataSource();

  private readonly onDestroy$ = new Subject<void>();

  constructor(
      private persistenceService: PersistenceService,
      private hotkeyRecorderService: HotkeyRecorderService,
      private toast: DtToast
  ) {}

  ngOnInit(): void {
    this.hotkeyRecorderService.hotkey$.subscribe((keys) => {
      if(this.isShortcutDetectionRunning) {
        this.detectedShortcut = keys;
        this.isShortcutDetectionRunning = false;
      }
    });
    this.persistenceService.getAllFlashcard().pipe(
      takeUntil(this.onDestroy$),
    )
      .subscribe((flashcards => this.dataSource.data = flashcards))
    this.dataSource.sort = this.sortable;
    this.dataSource.search = this.tableSearch;
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
