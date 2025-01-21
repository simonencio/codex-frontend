import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProfiliComponent } from './lista-profili.component';

describe('ListaProfiliComponent', () => {
  let component: ListaProfiliComponent;
  let fixture: ComponentFixture<ListaProfiliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaProfiliComponent]
    });
    fixture = TestBed.createComponent(ListaProfiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
