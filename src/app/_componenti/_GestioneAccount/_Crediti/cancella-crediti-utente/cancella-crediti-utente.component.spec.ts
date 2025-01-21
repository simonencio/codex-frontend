import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaCreditoComponent } from './cancella-crediti-utente.component';

describe('CancellaCreditoComponent', () => {
  let component: CancellaCreditoComponent;
  let fixture: ComponentFixture<CancellaCreditoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaCreditoComponent]
    });
    fixture = TestBed.createComponent(CancellaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
