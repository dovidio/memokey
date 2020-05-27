import {Component, OnInit, ViewChild} from "@angular/core";
import {PersistenceService} from "../core/services";
import {HotkeyRecorderService, HotkeyService} from "../core/services/hotkeys";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})
export class AddComponent implements OnInit {
  @ViewChild("shortcutLabel") shortcutLabel;

  constructor(
      private persistenceService: PersistenceService,
      private hotkeyRecorderService: HotkeyRecorderService,
      private hotkeyService: HotkeyService
  ) {}

  ngOnInit(): void {
    this.hotkeyRecorderService.hotkey$.subscribe((keys) =>
        this.addHotkey(keys)
    );
  }

  recognizeShortcut(): void {
    this.persistenceService.addFlashcard(
        this.shortcutLabel.nativeElement.value,
        ["bla"]
    );
  }

  addHotkey(keys: string[]): void {
    this.hotkeyService
        .addShortcut({ keys })
        .subscribe(() => console.log("I have seen this combination already🎉"));
  }
}
