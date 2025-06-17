import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaCategoria } from './crea-categoria';

describe('CreaCategoria', () => {
  let component: CreaCategoria;
  let fixture: ComponentFixture<CreaCategoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaCategoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaCategoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
