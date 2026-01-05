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

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule],
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
     private _transaccionesService: TransaccionesService, private _loginService: LoginService) {}

  public provincias: Provincias[] = [];
  public poblaciones: Poblaciones[] = [];
  public todasPoblaciones: Poblaciones[] = [];
  
  public password1 : string = '';
  public password2 : string = '';
  public direccion : string = '';
  public provincia: number | null = null;
  public ciudad : number | null = null;

  public ofertas : Servicios[] = [];
  public demandas : Servicios[] = [];
  public transacciones : Transacciones[] = [];

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

  cambiarContraseña() {
    if (this.password1 === this.password2 && this.usuario?.id) {
      this._loginService.cambiarContraseña(this.usuario.id, this.password1).subscribe({
        next: (response) => {
          console.log('Contraseña cambiada con éxito:', response);
          alert('Contraseña cambiada con éxito.');
        },
        error: (err) => {
          console.error('Error al cambiar la contraseña:', err);
          alert('Error al cambiar la contraseña.');
        }
      });
    } else {
      alert('Las contraseñas no coinciden o no hay usuario.');
    }
  }

  modifircarPerfil() {}

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
