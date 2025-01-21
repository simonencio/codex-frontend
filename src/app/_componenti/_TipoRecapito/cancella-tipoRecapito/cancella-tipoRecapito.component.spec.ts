import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellaCategorieComponent } from './cancella-tipoRecapito.component';

describe('CancellaCategorieComponent', () => {
  let component: CancellaCategorieComponent;
  let fixture: ComponentFixture<CancellaCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancellaCategorieComponent]
    });
    fixture = TestBed.createComponent(CancellaCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
