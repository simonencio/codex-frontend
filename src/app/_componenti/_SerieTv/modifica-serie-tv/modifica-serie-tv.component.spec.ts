import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaSerieTvComponent } from './modifica-serie-tv.component';

describe('ModificaSerieTvComponent', () => {
  let component: ModificaSerieTvComponent;
  let fixture: ComponentFixture<ModificaSerieTvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaSerieTvComponent]
    });
    fixture = TestBed.createComponent(ModificaSerieTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
