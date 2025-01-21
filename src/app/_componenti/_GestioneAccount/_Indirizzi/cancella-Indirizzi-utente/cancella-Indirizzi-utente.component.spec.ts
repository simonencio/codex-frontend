import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaIndirizziComponent } from './cancella-Indirizzi-utente.component';

describe('CancellaIndirizziComponent', () => {
  let component: CancellaIndirizziComponent;
  let fixture: ComponentFixture<CancellaIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaIndirizziComponent]
    });
    fixture = TestBed.createComponent(CancellaIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
