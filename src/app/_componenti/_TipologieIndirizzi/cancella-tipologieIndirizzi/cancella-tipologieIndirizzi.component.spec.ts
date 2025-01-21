import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaTipologieIndirizziComponent } from './cancella-tipologieIndirizzi.component';

describe('CancellaTipologieIndirizziComponent', () => {
  let component: CancellaTipologieIndirizziComponent;
  let fixture: ComponentFixture<CancellaTipologieIndirizziComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaTipologieIndirizziComponent]
    });
    fixture = TestBed.createComponent(CancellaTipologieIndirizziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
