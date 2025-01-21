import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiRecapitiComponent } from './aggiungi-recapiti-utente.component';

describe('AggiungiRecapitiComponent', () => {
  let component: AggiungiRecapitiComponent;
  let fixture: ComponentFixture<AggiungiRecapitiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiRecapitiComponent]
    });
    fixture = TestBed.createComponent(AggiungiRecapitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
