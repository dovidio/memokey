import { Component, OnInit, ViewChild } from '@angular/core';
import {FlashCard, PersistenceService} from '../core/services';
import {DtTableDataSource} from "@dynatrace/barista-components/table";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  @ViewChild('shortcutLabel') shortcutLabel;

  myShortcuts: FlashCard[];
  myShortcutsTableSource: DtTableDataSource<FlashCard>;

  constructor(private persistenceService: PersistenceService) {
    this.myShortcutsTableSource = new DtTableDataSource<FlashCard>(this.myShortcuts);
  }

  ngOnInit(): void {
  }

  recognizeShortcut(): void {
    console.log(this.shortcutLabel.nativeElement.value);
    console.log(this.persistenceService.addShortcut(this.shortcutLabel.nativeElement.value, 'bla'));
  }
}
