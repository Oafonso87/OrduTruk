import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ordutruk } from './ordutruk';

describe('OrdutrukComponent', () => {
  let component: Ordutruk;
  let fixture: ComponentFixture<Ordutruk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ordutruk]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Ordutruk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
