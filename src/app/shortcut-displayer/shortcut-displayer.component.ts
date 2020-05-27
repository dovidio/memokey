import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-shortcut-displayer',
  templateUrl: './shortcut-displayer.component.html',
  styleUrls: ['./shortcut-displayer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortcutDisplayerComponent {

  @Input()
  keys: string[];

}
