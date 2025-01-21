import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaCreditoComponent } from './modifica-crediti.component';

describe('ModificaCreditoComponent', () => {
  let component: ModificaCreditoComponent;
  let fixture: ComponentFixture<ModificaCreditoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaCreditoComponent]
    });
    fixture = TestBed.createComponent(ModificaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
