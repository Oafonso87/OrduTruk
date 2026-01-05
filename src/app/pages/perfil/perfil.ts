import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse } from '../../models/apiresponse';
import { Usuario } from '../../models/usuarios';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { Provincias } from '../../models/provincias';
import { Poblaciones } from '../../models/poblaciones';
import { Servicios } from '../../models/servicios';
import { ServiciosService } from '../../services/servicios.service';
import { Transacciones } from '../../models/transacciones';
import { TransaccionesService } from '../../services/transacciones.service';
import { LoginService } from '../../services/login.service';
import { MensajesService } from '../../services/mensajes.service';
import { Mensaje } from '../../models/mensaje';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule, RouterLink],
    templateUrl: './perfil.html',
    styleUrl: './perfil.scss',
})

export class Perfil implements OnInit {
    
  public usuario : Usuario | null = null;    

  ngOnInit(): void {
    const userAlmacenado = sessionStorage.getItem('user');
    if (userAlmacenado) {
      this.usuario = JSON.parse(userAlmacenado);
      
      // Inicializamos las variables con los datos actuales
      this.provincia = this.usuario?.provincia_id ? Number(this.usuario.provincia_id) : null;
      this.ciudad = this.usuario?.ciudad_id ? Number(this.usuario.ciudad_id) : null;
      this.direccion = this.usuario?.direccion || '';
    }
    
    this.loadProvincias();
    this.loadTodasPoblaciones();
    this.loadServicios();
    this.loadTransacciones();
  }

  constructor(private _ubicacionesService: UbicacionesService, private _serviciosService: ServiciosService,
    private _transaccionesService: TransaccionesService, private _loginService: LoginService,
    private _usuariosService: UsuariosService, private _mensajesService: MensajesService) {}

  public provincias: Provincias[] = [];
  public poblaciones: Poblaciones[] = [];
  public todasPoblaciones: Poblaciones[] = [];
  
  public password1 : string = '';
  public password2 : string = '';
  public direccion : string = '';
  public provincia: number | null = null;
  public ciudad : number | null = null;
  public imagen: File | null = null;


  public ofertas : Servicios[] = [];
  public demandas : Servicios[] = [];
  public transacciones : Transacciones[] = [];

  public p_actual: number = 1;
  public itemsPorPagina: number = 3;

  modificar() {}

  loadProvincias() {
    this._ubicacionesService.getProvincias().subscribe({
      next: (response: ApiResponse<Provincias[]>) => {
      this.provincias = response.data;
      console.log('Provincias cargadas:', this.provincias);
    },
      error: (err) => {
      console.error('Error al cargar las provincias:', err);
      } 
    });
  }  

  loadTodasPoblaciones() {
    this._ubicacionesService.getPoblaciones().subscribe({
      next: (response: ApiResponse<Poblaciones[]>) => {
        this.todasPoblaciones = response.data;     
        
        if (this.provincia) {
          this.poblaciones = this.todasPoblaciones.filter(
            p => Number(p.provincia_id) === this.provincia
          );
        }
      },
      error: (err) => console.error('Error:', err)
    });
  }

  onProvinciaChange(valor: any) {
    this.provincia = Number(valor);
    this.ciudad = null;

    this.poblaciones = this.todasPoblaciones.filter(
      p => Number(p.provincia_id) === this.provincia
    );
  }  

  loadServicios() {
    this._serviciosService.getServicios().subscribe({
      next: (response: ApiResponse<Servicios[]>) => {
        const servicios = response.data.filter(s => s.usuario_id === this.usuario?.id);
        this.ofertas = servicios.filter(s => s.tipo === 'oferta');
        this.demandas = servicios.filter(s => s.tipo === 'demanda');
      },
      error: (err) => console.error('Error:', err)
    });
  }

  loadTransacciones() {
    this._transaccionesService.getTransacciones().subscribe({
      next: (response: ApiResponse<Transacciones[]>) => {
        this.transacciones = response.data.filter(t => 
          t.usuario_solicitante_id === this.usuario?.id || 
          t.usuario_ofertante_id === this.usuario?.id
        );

        console.log('Mis transacciones implicadas:', this.transacciones);
      },
      error: (err) => console.error('Error al cargar transacciones:', err)
    });
  }  

  cambiarPassword() {
    if (this.password1 && this.password1 === this.password2 && this.usuario?.id) {
      
      if (this.password1.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      this._loginService.cambiarContraseña(this.usuario.id, this.password1).subscribe({
        next: (response) => {
          console.log('Contraseña cambiada con éxito:', response);
          alert('Contraseña cambiada con éxito.');
          this.password1 = '';
          this.password2 = '';
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err);
          const msg = err.error?.message || 'Error al cambiar la contraseña.';
          alert(msg);
        }
      });
    } else {
      alert('Las contraseñas no coinciden o están vacías.');
    }
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
  }

  modificarPerfil() {
    if (!this.usuario?.id) return;

    const formData = new FormData();
    
    if (this.direccion) formData.append('direccion', this.direccion);
    if (this.provincia) formData.append('provincia_id', this.provincia.toString());
    if (this.ciudad) formData.append('ciudad_id', this.ciudad.toString());
    
    if (this.imagen) {
        formData.append('img', this.imagen);
    }

    this._usuariosService.updateUsuario(this.usuario.id, formData).subscribe({
        next: (response) => {
            console.log('Perfil actualizado:', response);
            alert('Datos actualizados correctamente');
            
            const usuarioActualizado = { ...this.usuario, ...response.data };
            sessionStorage.setItem('user', JSON.stringify(usuarioActualizado));
            this.usuario = usuarioActualizado;
        },
        error: (err) => {
            console.error('Error al actualizar perfil:', err);
            alert('No se pudo actualizar el perfil.');
        }
    });
  }

  get totalPaginasOfertas(): number[] {
    const paginas = Math.ceil(this.ofertas.length / this.itemsPorPagina);
    return Array.from({ length: paginas }, (_, i) => i + 1);
  }

  get ofertasPaginadas(): Servicios[] {
    const inicio = (this.p_actual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.ofertas.slice(inicio, fin);
  }

  get totalPaginasDemandas(): number[] {
    const paginas = Math.ceil(this.demandas.length / this.itemsPorPagina);
    return Array.from({ length: paginas }, (_, i) => i + 1);
  }

  get demandasPaginadas(): Servicios[] {
    const inicio = (this.p_actual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.demandas.slice(inicio, fin);
  }

  get totalPaginasTransaccion(): number[] {
    const paginas = Math.ceil(this.transacciones.length / this.itemsPorPagina);
    return Array.from({ length: paginas }, (_, i) => i + 1);
  }

  get transaccionesPaginadas(): Transacciones[] {
    const inicio = (this.p_actual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.transacciones.slice(inicio, fin);
  }

  cancelar(id : number) {
    const formData = new FormData();
    formData.append('estado', 'cancelado');

    this._serviciosService.updateServicio(id, formData).subscribe({
      next: (resOferta) => {
        console.log('1. Oferta actualizada a cancelado');
        this.loadServicios();
      },
      error: (err) => {
        console.error('Error al actualizar oferta:', err);
        alert('Hubo un error al cancelar la oferta.');
      }
    });
  }

  rechazar(id: number) {
    const tOriginal = this.transacciones.find(t => t.id === id);
    if (!tOriginal || !this.usuario) return;

    if (confirm('¿Estás seguro de rechazar? Se devolverán las horas al solicitante y la oferta volverá a estar activa.')) {

      const datosT = { ...tOriginal, estado: 'cancelado' };

      this._transaccionesService.updateTransaccion(datosT).subscribe({
        next: () => {

          const fdServicio = new FormData();
          fdServicio.append('estado', 'activo');
          
          this._serviciosService.updateServicio(tOriginal.servicio_id, fdServicio).subscribe({
            next: () => {

              const fdUsuario = new FormData();
              const saldoActual = Number(tOriginal.usuario_solicitante?.horas_saldo || 0);
              const nuevoSaldo = saldoActual + Number(tOriginal.horas);
              fdUsuario.append('horas_saldo', nuevoSaldo.toString());

              this._usuariosService.updateUsuario(tOriginal.usuario_solicitante_id, fdUsuario).subscribe({
                next: () => {
                  
                  const mensajeRechazo: any = {
                      emisor_id: this.usuario!.id,
                      receptor_id: tOriginal.usuario_solicitante_id,
                      servicio_id: tOriginal.servicio_id,
                      mensaje: "Oferta rechazada. Transacción cancelada. Se han reintegrado tus horas.",
                      leido: false
                  };

                  this._mensajesService.createMensaje(mensajeRechazo).subscribe({
                    next: () => {
                      alert('Proceso completado: Transacción cancelada, horas devueltas y usuario notificado.');

                      tOriginal.estado = 'cancelado';
                      const oferta = this.ofertas.find(o => o.id === tOriginal.servicio_id);
                      if (oferta) oferta.estado = 'activo';
                    },
                    error: (err) => console.error('Error al enviar mensaje:', err)
                  });
                },
                error: (err) => console.error('Error al actualizar usuario:', err)
              });
            },
            error: (err) => console.error('Error al actualizar servicio:', err)
          });
        },
        error: (err) => console.error('Error al actualizar transacción:', err)
      });
    }
  }
  

  capitalizar(texto: string): string {
    if (!texto) return '';
    return texto
      .trim()
      .toLowerCase()
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

}
