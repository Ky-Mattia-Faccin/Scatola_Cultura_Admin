import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilitaDisabilita } from './disabilita-disabilita';

describe('DisabilitaDisabilita', () => {
  let component: DisabilitaDisabilita;
  let fixture: ComponentFixture<DisabilitaDisabilita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisabilitaDisabilita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisabilitaDisabilita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
