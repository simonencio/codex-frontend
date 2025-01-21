import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiSerieTvComponent } from './aggiungi-film.component';

describe('AggiungiSerieTvComponent', () => {
  let component: AggiungiSerieTvComponent;
  let fixture: ComponentFixture<AggiungiSerieTvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiSerieTvComponent]
    });
    fixture = TestBed.createComponent(AggiungiSerieTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
