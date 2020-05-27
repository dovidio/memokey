import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {HotkeyRecorderService} from "../core/services/hotkeys";

@Component({
  selector: 'app-currently-pressed-keys',
  templateUrl: './currently-pressed-keys.component.html',
  styles: ['.pressed-keys { margin: 10px; background-color: white}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentlyPressedKeysComponent {
  constructor(public hotkeyRecorderService: HotkeyRecorderService) {
  }
}
