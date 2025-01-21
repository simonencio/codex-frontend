import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaCategorieComponent } from './modifica-categorie.component';

describe('ModificaCategorieComponent', () => {
  let component: ModificaCategorieComponent;
  let fixture: ComponentFixture<ModificaCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificaCategorieComponent]
    });
    fixture = TestBed.createComponent(ModificaCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
