import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaSerieTvComponent } from './cancella-serie-tv.component';

describe('CancellaSerieTvComponent', () => {
  let component: CancellaSerieTvComponent;
  let fixture: ComponentFixture<CancellaSerieTvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaSerieTvComponent]
    });
    fixture = TestBed.createComponent(CancellaSerieTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
