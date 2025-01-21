import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaTipologieIndirizziComponent } from './modifica-tipologieIndirizzi.component';

describe('ModificaTipologieIndirizziComponent', () => {
  let component: ModificaTipologieIndirizziComponent;
  let fixture: ComponentFixture<ModificaTipologieIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaTipologieIndirizziComponent]
    });
    fixture = TestBed.createComponent(ModificaTipologieIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
