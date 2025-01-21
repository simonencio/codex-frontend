import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodiModalComponent } from './episodi-modal.component';

describe('EpisodiModalComponent', () => {
  let component: EpisodiModalComponent;
  let fixture: ComponentFixture<EpisodiModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodiModalComponent]
    });
    fixture = TestBed.createComponent(EpisodiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
