import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaProfiliComponent } from './modifica-profili-utente.component';

describe('ModificaProfiliComponent', () => {
  let component: ModificaProfiliComponent;
  let fixture: ComponentFixture<ModificaProfiliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaProfiliComponent]
    });
    fixture = TestBed.createComponent(ModificaProfiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
