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
    this.persistenceService.addFlashcard(this.shortcutLabel.nativeElement.value, 'bla')
  }
}
