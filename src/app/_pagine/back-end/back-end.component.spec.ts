import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieTvComponent } from './back-end.component';

describe('SerieTvComponent', () => {
  let component: SerieTvComponent;
  let fixture: ComponentFixture<SerieTvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerieTvComponent]
    });
    fixture = TestBed.createComponent(SerieTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
