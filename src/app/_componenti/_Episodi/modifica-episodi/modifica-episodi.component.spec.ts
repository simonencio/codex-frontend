import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaEpisodiComponent } from './modifica-episodi.component';

describe('ModificaEpisodiComponent', () => {
  let component: ModificaEpisodiComponent;
  let fixture: ComponentFixture<ModificaEpisodiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaEpisodiComponent]
    });
    fixture = TestBed.createComponent(ModificaEpisodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
