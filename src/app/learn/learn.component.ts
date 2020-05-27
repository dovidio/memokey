import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {

  constructor() { }

  isAnswerShown: boolean = false;

  ngOnInit(): void {
  }

  onShowAnswer() {
    // TODO actually show answer
    this.isAnswerShown = true;
  }

}
