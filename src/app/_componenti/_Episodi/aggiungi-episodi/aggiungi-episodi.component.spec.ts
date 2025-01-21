import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiEpisodiComponent } from './aggiungi-episodi.component';

describe('AggiungiSerieTvComponent', () => {
  let component: AggiungiEpisodiComponent;
  let fixture: ComponentFixture<AggiungiEpisodiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiEpisodiComponent]
    });
    fixture = TestBed.createComponent(AggiungiEpisodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
