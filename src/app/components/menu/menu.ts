import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../button/button';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [Button],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {

  constructor(private router: Router) { }

  get isPublic(): boolean {
    const publicRoutes = ['/', '/acceso', '/registro'];
    return publicRoutes.includes(this.router.url);
  }

  public dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

}

