import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiCategorieComponent } from './aggiungi-tipoRecapito.component';

describe('AggiungiCategorieComponent', () => {
  let component: AggiungiCategorieComponent;
  let fixture: ComponentFixture<AggiungiCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggiungiCategorieComponent]
    });
    fixture = TestBed.createComponent(AggiungiCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
