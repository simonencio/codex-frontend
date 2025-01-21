import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiCreditoComponent } from './aggiungi-crediti.component';

describe('AggiungiCreditoComponent', () => {
  let component: AggiungiCreditoComponent;
  let fixture: ComponentFixture<AggiungiCreditoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiCreditoComponent]
    });
    fixture = TestBed.createComponent(AggiungiCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
