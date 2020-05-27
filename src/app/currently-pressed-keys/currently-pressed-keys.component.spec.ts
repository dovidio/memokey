import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentlyPressedKeysComponent } from './currently-pressed-keys.component';

describe('CurrentlyPressedKeysComponent', () => {
  let component: CurrentlyPressedKeysComponent;
  let fixture: ComponentFixture<CurrentlyPressedKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentlyPressedKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentlyPressedKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
