import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiIndirizziComponent } from './aggiungi-Indirizzi.component';

describe('AggiungiIndirizziComponent', () => {
  let component: AggiungiIndirizziComponent;
  let fixture: ComponentFixture<AggiungiIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiIndirizziComponent]
    });
    fixture = TestBed.createComponent(AggiungiIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
