import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiTipologieIndirizziComponent } from './aggiungi-tipologieIndirizzi.component';

describe('AggiungiTipologieIndirizziComponent', () => {
  let component: AggiungiTipologieIndirizziComponent;
  let fixture: ComponentFixture<AggiungiTipologieIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiTipologieIndirizziComponent]
    });
    fixture = TestBed.createComponent(AggiungiTipologieIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
