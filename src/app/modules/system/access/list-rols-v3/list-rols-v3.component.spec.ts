import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRolsV3Component } from './list-rols-v3.component';

describe('ListRolsV3Component', () => {
  let component: ListRolsV3Component;
  let fixture: ComponentFixture<ListRolsV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRolsV3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRolsV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
