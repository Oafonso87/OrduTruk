import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('access_token');

    if (token) {
      // Si hay token, permite acceder a la ruta
      return true;
    } else {
      // Si no hay token, redirige a login
      this.router.navigate(['/']);
      return false;
    }
  }
}

