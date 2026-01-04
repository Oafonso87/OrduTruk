import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Button } from '../button/button';
import { Usuario } from '../../models/usuarios';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [Button, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit, OnDestroy {

  public usuario : Usuario | null = null;
  private saldoSub: Subscription | null = null;

  ngOnInit(): void {
    this.cargarUsuarioDeStorage();

    this.saldoSub = this._usuariosService.actualizarSaldo$.subscribe(() => {
      this.refrescarDatosUsuario();
    });
  }

  ngOnDestroy(): void {
    if (this.saldoSub) {
      this.saldoSub.unsubscribe();
    }
  }

  constructor(private readonly _router: Router, private readonly _loginService: LoginService, 
    private readonly _usuariosService: UsuariosService) {}

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

  private cargarUsuarioDeStorage() {
    const userAlmacenado = sessionStorage.getItem('user');
    if (userAlmacenado) {
      this.usuario = JSON.parse(userAlmacenado);
    }
  }

  private refrescarDatosUsuario() {
    if (this.usuario?.id) {
      this._usuariosService.getUsuarioById(this.usuario.id).subscribe({
        next: (response) => {
          this.usuario = response.data;
          sessionStorage.setItem('user', JSON.stringify(this.usuario));
          console.log('Saldo actualizado en tiempo real:', this.usuario.horas_saldo);
        },
        error: (err) => console.error('Error al refrescar saldo:', err)
      });
    }
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