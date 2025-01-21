import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIndirizziComponent } from './lista-Indirizzi-utente.component';

describe('ListaIndirizziComponent', () => {
  let component: ListaIndirizziComponent;
  let fixture: ComponentFixture<ListaIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaIndirizziComponent]
    });
    fixture = TestBed.createComponent(ListaIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
