import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaTipoRecapitoComponent } from './modifica-tipoRecapito.component';

describe('ModificaTipoRecapitoComponent', () => {
  let component: ModificaTipoRecapitoComponent;
  let fixture: ComponentFixture<ModificaTipoRecapitoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaTipoRecapitoComponent]
    });
    fixture = TestBed.createComponent(ModificaTipoRecapitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
