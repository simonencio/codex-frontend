import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaEpisodiComponent } from './cancella-episodi.component';

describe('CancellaSerieTvComponent', () => {
  let component: CancellaEpisodiComponent;
  let fixture: ComponentFixture<CancellaEpisodiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaEpisodiComponent]
    });
    fixture = TestBed.createComponent(CancellaEpisodiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
