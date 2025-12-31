import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Button } from '../button/button';
import { Usuario } from '../../models/usuarios';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [Button, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {

  public usuario : Usuario | null = null;

  ngOnInit(): void {
    const userAlmacenado = sessionStorage.getItem('user');
      if (userAlmacenado) {
          this.usuario = JSON.parse(userAlmacenado);
      }
      console.log(userAlmacenado);
  }

  constructor(private readonly _router: Router, private readonly _loginService: LoginService) { }

  get isPublic(): boolean {
    const publicRoutes = ['/', '/acceso', '/registro'];
    return publicRoutes.includes(this._router.url);
  }

  get isInfoPage(): boolean {
    return ['/quienes-somos', '/terminos-uso'].includes(this._router.url);
  }

  public dropdownOpen: boolean = false;
  public menuPerfilAbierto: boolean = false;
  public isMenuOpen: boolean = false;
  public mensajesNoLeidos: number = 5;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMenuPerfil() {
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this._loginService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso');            
        localStorage.clear();
        sessionStorage.clear();
        this._router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);       
      }
    });    
  }
}

