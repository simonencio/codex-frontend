import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaRecapitiComponent } from './modifica-recapiti.component';

describe('ModificaRecapitiComponent', () => {
  let component: ModificaRecapitiComponent;
  let fixture: ComponentFixture<ModificaRecapitiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaRecapitiComponent]
    });
    fixture = TestBed.createComponent(ModificaRecapitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
