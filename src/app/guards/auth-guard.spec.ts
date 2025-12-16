import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  let guard: authGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        authGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(authGuard);
    sessionStorage.clear();
  });

  it('should allow access if token exists', () => {
    sessionStorage.setItem('access_token', '123');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to / if no token', () => {
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});