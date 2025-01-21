import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiProfiliComponent } from './aggiungi-profili-utente.component';

describe('AggiungiProfiliComponent', () => {
  let component: AggiungiProfiliComponent;
  let fixture: ComponentFixture<AggiungiProfiliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiProfiliComponent]
    });
    fixture = TestBed.createComponent(AggiungiProfiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
