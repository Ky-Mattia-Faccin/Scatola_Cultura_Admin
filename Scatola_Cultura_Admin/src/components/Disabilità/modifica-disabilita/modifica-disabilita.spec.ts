import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaDisabilita } from './modifica-disabilita';

describe('ModificaDisabilita', () => {
  let component: ModificaDisabilita;
  let fixture: ComponentFixture<ModificaDisabilita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificaDisabilita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaDisabilita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
