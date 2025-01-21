import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiliComponent } from './profili.component';

describe('ProfiliComponent', () => {
  let component: ProfiliComponent;
  let fixture: ComponentFixture<ProfiliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfiliComponent]
    });
    fixture = TestBed.createComponent(ProfiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
