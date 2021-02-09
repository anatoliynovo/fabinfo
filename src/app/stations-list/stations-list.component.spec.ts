import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsListComponent } from './stations-list.component';

describe('StationsListComponent', () => {
  let component: StationsListComponent;
  let fixture: ComponentFixture<StationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
