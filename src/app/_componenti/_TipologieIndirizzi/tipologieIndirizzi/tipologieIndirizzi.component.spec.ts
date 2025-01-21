import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipologieIndirizziComponent } from './tipologieIndirizzi.component';

describe('TipologieIndirizziComponent', () => {
  let component: TipologieIndirizziComponent;
  let fixture: ComponentFixture<TipologieIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipologieIndirizziComponent]
    });
    fixture = TestBed.createComponent(TipologieIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
