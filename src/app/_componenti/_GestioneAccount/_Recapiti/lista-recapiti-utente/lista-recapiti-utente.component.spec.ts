import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRecapitiComponent } from './lista-recapiti-utente.component';

describe('ListaRecapitiComponent', () => {
  let component: ListaRecapitiComponent;
  let fixture: ComponentFixture<ListaRecapitiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaRecapitiComponent]
    });
    fixture = TestBed.createComponent(ListaRecapitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
