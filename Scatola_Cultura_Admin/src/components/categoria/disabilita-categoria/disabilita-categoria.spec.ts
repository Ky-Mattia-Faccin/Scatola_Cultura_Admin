import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilitaCategoria } from './disabilita-categoria';

describe('DisabilitaCategoria', () => {
  let component: DisabilitaCategoria;
  let fixture: ComponentFixture<DisabilitaCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisabilitaCategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisabilitaCategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
