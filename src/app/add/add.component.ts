import { Component, OnInit, ViewChild } from '@angular/core';
import { PersistenceService } from '../core/services';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  @ViewChild('shortcutLabel') shortcutLabel;

  constructor(private persistenceService: PersistenceService) { 
  }

  ngOnInit(): void {
  }

  recognizeShortcut(): void {
    console.log(this.shortcutLabel.nativeElement.value);
    console.log(this.persistenceService.addShortcut(this.shortcutLabel.nativeElement.value, 'bla'));
  }
}
