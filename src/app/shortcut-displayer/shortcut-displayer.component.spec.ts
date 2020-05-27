import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutDisplayerComponent } from './shortcut-displayer.component';

describe('ShortcutDisplayerComponent', () => {
  let component: ShortcutDisplayerComponent;
  let fixture: ComponentFixture<ShortcutDisplayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortcutDisplayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
