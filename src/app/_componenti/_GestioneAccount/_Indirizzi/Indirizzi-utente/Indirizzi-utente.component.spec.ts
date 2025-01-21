import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirizziComponent } from './Indirizzi-utente.component';

describe('IndirizziComponent', () => {
  let component: IndirizziComponent;
  let fixture: ComponentFixture<IndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndirizziComponent]
    });
    fixture = TestBed.createComponent(IndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
