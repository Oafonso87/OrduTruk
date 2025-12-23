import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosUso } from './terminos-uso';

describe('TerminosUso', () => {
  let component: TerminosUso;
  let fixture: ComponentFixture<TerminosUso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosUso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminosUso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
