import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSerieTvComponent } from './lista-serie-tv.component';

describe('ListaSerieTvComponent', () => {
  let component: ListaSerieTvComponent;
  let fixture: ComponentFixture<ListaSerieTvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaSerieTvComponent]
    });
    fixture = TestBed.createComponent(ListaSerieTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
