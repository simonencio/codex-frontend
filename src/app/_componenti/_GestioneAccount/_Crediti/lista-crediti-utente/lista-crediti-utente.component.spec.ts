import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCreditoComponent } from './lista-crediti-utente.component';

describe('ListaCreditoComponent', () => {
  let component: ListaCreditoComponent;
  let fixture: ComponentFixture<ListaCreditoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaCreditoComponent]
    });
    fixture = TestBed.createComponent(ListaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
