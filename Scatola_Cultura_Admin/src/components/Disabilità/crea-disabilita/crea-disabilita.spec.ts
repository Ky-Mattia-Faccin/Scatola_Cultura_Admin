import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaDisabilita } from './crea-disabilita';

describe('CreaDisabilita', () => {
  let component: CreaDisabilita;
  let fixture: ComponentFixture<CreaDisabilita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaDisabilita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaDisabilita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
