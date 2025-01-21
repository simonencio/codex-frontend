import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTipologieIndirizziComponent } from './lista-tipologieIndirizzi.component';

describe('ListaTipologieIndirizziComponent', () => {
  let component: ListaTipologieIndirizziComponent;
  let fixture: ComponentFixture<ListaTipologieIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTipologieIndirizziComponent]
    });
    fixture = TestBed.createComponent(ListaTipologieIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
