import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaProfiliComponent } from './cancella-profili-utente.component';

describe('CancellaProfiliComponent', () => {
  let component: CancellaProfiliComponent;
  let fixture: ComponentFixture<CancellaProfiliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaProfiliComponent]
    });
    fixture = TestBed.createComponent(CancellaProfiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
