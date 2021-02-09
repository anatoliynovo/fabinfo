import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningSafetyComponent } from './warning-safety.component';

describe('WarningSafetyComponent', () => {
  let component: WarningSafetyComponent;
  let fixture: ComponentFixture<WarningSafetyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningSafetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
