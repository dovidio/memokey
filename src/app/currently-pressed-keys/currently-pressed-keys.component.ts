import { Component, OnInit } from '@angular/core';
import {HotkeyRecorderService} from "../core/services/hotkeys";

@Component({
  selector: 'app-currently-pressed-keys',
  templateUrl: './currently-pressed-keys.component.html',
  styleUrls: ['./currently-pressed-keys.component.scss']
})
export class CurrentlyPressedKeysComponent implements OnInit {

  constructor(public hotkeyRecorderService: HotkeyRecorderService) { }

  ngOnInit(): void {
  }

}
