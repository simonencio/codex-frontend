import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneAccountComponent } from './gestione-account.component';

describe('GestioneAccountComponent', () => {
  let component: GestioneAccountComponent;
  let fixture: ComponentFixture<GestioneAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestioneAccountComponent]
    });
    fixture = TestBed.createComponent(GestioneAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
