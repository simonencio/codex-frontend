import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmESerieComponent } from './film-e-serie.component';

describe('FilmESerieComponent', () => {
  let component: FilmESerieComponent;
  let fixture: ComponentFixture<FilmESerieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilmESerieComponent]
    });
    fixture = TestBed.createComponent(FilmESerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
