import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Button } from '../button/button';
import { Usuario } from '../../models/usuarios';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';
import { UsuariosService } from '../../services/usuarios.service';
import { Mensaje } from '../../models/mensaje';
import { MensajesService } from '../../services/mensajes.service';

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
    this.loadMensajes();
    // Escucha cambios globales en el saldo (ej. tras una transacción) para actualizar la cabecera
    this.saldoSub = this._usuariosService.actualizarSaldo$.subscribe(() => {
      this.refrescarDatosUsuario();
    });
  }

  ngOnDestroy(): void {
    if (this.saldoSub) {
    // Liberamos la suscripción al cerrar el componente para evitar consumo de memoria
      this.saldoSub.unsubscribe();
    }
  }

  constructor(private readonly _router: Router, private readonly _loginService: LoginService, 
    private readonly _usuariosService: UsuariosService, private readonly _mensajesService: MensajesService) {}

  // Getters para controlar la visibilidad de elementos según la ruta activa
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
  public mensajesNoLeidos: Mensaje[] = [];

  // Métodos de control para el despliegue de menús y submenús
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

  // Sincroniza los datos del usuario con el servidor para actualizar el saldo de horas
  private refrescarDatosUsuario() {
    if (this.usuario?.id) {
      this._usuariosService.getUsuarioById(this.usuario.id).subscribe({
        next: (response) => {
          this.usuario = response.data;
          sessionStorage.setItem('user', JSON.stringify(this.usuario));
        },
        error: (err) => console.error('Error al refrescar saldo:', err)
      });
    }
  }

  // Carga y filtra únicamente los mensajes recibidos que aún no han sido leídos por el usuario
  loadMensajes() {
    if (this.usuario?.id) {
      this._mensajesService.getMensajesById(this.usuario.id).subscribe({
        next: (response) => {
          const todosLosMensajes = response.data;
          this.mensajesNoLeidos = todosLosMensajes.filter(mensaje => !mensaje.leido && mensaje.receptor_id === this.usuario?.id);
        }
      });
    }
  }

  /**
   * Navega a la bandeja de entrada, limpiando previamente los indicadores visuales 
   * y lanzando las peticiones para marcar los mensajes como leídos en el servidor.
   */
  irAMensajes() {
    if (this.mensajesNoLeidos.length > 0) {
      const mensajesParaActualizar = [...this.mensajesNoLeidos];
      // Reseteamos el estado local para que el badge desaparezca instantáneamente al hacer clic
      this.mensajesNoLeidos = [];
      this.dropdownOpen = false;
      this.menuPerfilAbierto = false;
      // Actualizamos cada mensaje de forma asíncrona en la base de datos
      mensajesParaActualizar.forEach(mensaje => {
        const mensajeLeido = { ...mensaje, leido: true };        
        this._mensajesService.updateMensaje(mensajeLeido).subscribe({
          next: () => {
          },
          error: (err) => console.error('Error al actualizar mensaje', err)
        });
      });
      this.mensajesNoLeidos = [];
    }  
    this._router.navigate(['/mensajes']);
  }

  logout() {
    this._loginService.logout().subscribe({
      next: () => {
        // Limpiamos todo rastro de sesión antes de redirigir al inicio
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