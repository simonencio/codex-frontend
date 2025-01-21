import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaRecapitiComponent } from './cancella-recapiti-utente.component';

describe('CancellaRecapitiComponent', () => {
  let component: CancellaRecapitiComponent;
  let fixture: ComponentFixture<CancellaRecapitiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaRecapitiComponent]
    });
    fixture = TestBed.createComponent(CancellaRecapitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
