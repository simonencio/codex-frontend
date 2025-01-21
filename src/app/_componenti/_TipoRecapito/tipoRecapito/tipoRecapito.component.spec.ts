import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoRecapitoComponent } from './tipoRecapito.component';

describe('TipoRecapitoComponent', () => {
  let component: TipoRecapitoComponent;
  let fixture: ComponentFixture<TipoRecapitoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TipoRecapitoComponent]
    });
    fixture = TestBed.createComponent(TipoRecapitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
