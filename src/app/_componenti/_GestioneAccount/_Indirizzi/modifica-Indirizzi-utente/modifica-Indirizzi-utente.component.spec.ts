import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaIndirizziComponent } from './modifica-Indirizzi-utente.component';

describe('ModificaIndirizziComponent', () => {
  let component: ModificaIndirizziComponent;
  let fixture: ComponentFixture<ModificaIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaIndirizziComponent]
    });
    fixture = TestBed.createComponent(ModificaIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
