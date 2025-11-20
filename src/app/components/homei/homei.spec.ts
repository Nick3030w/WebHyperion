import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homei } from './homei';

describe('Homei', () => {
  let component: Homei;
  let fixture: ComponentFixture<Homei>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homei]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homei);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
