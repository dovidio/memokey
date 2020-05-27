import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-feedback-component',
  templateUrl: './feedback-component.component.html',
  styleUrls: ['./feedback-component.component.css']
})
export class FeedbackComponentComponent implements OnInit {

  @Input() askFeedback: boolean;
  @Input() correctAnswer: string;
  @Output() gradeEmitter = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
}
