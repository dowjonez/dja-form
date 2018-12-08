import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjaFormComponent } from './dja-form.component';

describe('DjaFormComponent', () => {
  let component: DjaFormComponent;
  let fixture: ComponentFixture<DjaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
