import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenzaComponent } from './residenza.component';

describe('ResidenzaComponent', () => {
  let component: ResidenzaComponent;
  let fixture: ComponentFixture<ResidenzaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResidenzaComponent]
    });
    fixture = TestBed.createComponent(ResidenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
