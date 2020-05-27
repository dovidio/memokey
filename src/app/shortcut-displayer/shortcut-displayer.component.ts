import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-shortcut-displayer',
  templateUrl: './shortcut-displayer.component.html',
  styleUrls: ['./shortcut-displayer.component.css']
})
export class ShortcutDisplayerComponent {

  @Input()
  keys: string[];

}
