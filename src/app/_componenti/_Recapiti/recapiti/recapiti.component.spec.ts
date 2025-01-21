import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapitiComponent } from './recapiti.component';

describe('RecapitiComponent', () => {
  let component: RecapitiComponent;
  let fixture: ComponentFixture<RecapitiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecapitiComponent]
    });
    fixture = TestBed.createComponent(RecapitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
