import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEpisodiComponent } from './lista-episodi.component';

describe('ListaEpisodiComponent', () => {
  let component: ListaEpisodiComponent;
  let fixture: ComponentFixture<ListaEpisodiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaEpisodiComponent]
    });
    fixture = TestBed.createComponent(ListaEpisodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
