import { Component, OnInit } from '@angular/core';
import { Button } from '../../components/button/button';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse } from '../../models/apiresponse';
import { Usuario } from '../../models/usuarios';
import { FormsModule } from '@angular/forms';
import { Provincias } from '../../models/provincias';
import { Poblaciones } from '../../models/poblaciones';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginResponse } from '../../models/loginresponse';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ Header, Footer, RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro implements OnInit {

  ngOnInit(): void {
    // Inicialización de catálogos geográficos para el formulario de inscripción
    this.loadProvincias();
    this.loadTodasPoblaciones();  
  }

  constructor(private _ubicacionesService : UbicacionesService, private _router : Router, private _usuariosService : UsuariosService) {}

  // Colecciones para la gestión de selectores dinámicos
  public usuarios: Usuario[] = [];
  public provincias: Provincias[] = [];
  public poblaciones: Poblaciones[] = [];
  public todasPoblaciones: Poblaciones[] = [];
  
  // Modelos vinculados a los campos del formulario
  public nombre : string = '';
  public apellidos : string = '';
  public mail : string = '';
  public password1 : string = '';
  public password2 : string = '';
  public direccion : string = '';
  public provincia: number | null = null;
  public ciudad : string = '';
  public imagen: File | null = null;

  // Recupera el listado de provincias desde la API
  loadProvincias() {
    this._ubicacionesService.getProvincias().subscribe({
      next: (response: ApiResponse<Provincias[]>) => {
      this.provincias = response.data;
    },
      error: (err) => {
      console.error('Error al cargar las provincias:', err);
      } 
    });
  }  

  // Carga todas las poblaciones para realizar el filtrado reactivo en el cliente
  loadTodasPoblaciones() {
    this._ubicacionesService.getPoblaciones().subscribe({
      next: (response: ApiResponse<Poblaciones[]>) => {
        this.todasPoblaciones = response.data;
      },
      error: (err) => {
        console.error('Error al cargar todas las poblaciones:', err);
      }
    });
  }

  /**
   * Actualiza el listado de ciudades según la provincia seleccionada.
   * Resetea el valor de la ciudad para evitar inconsistencias en el envío.
   */
  onProvinciaChange(valor: any) {
    const provinciaId = Number(valor);   
    this.provincia = provinciaId;
    this.ciudad = '';

    this.poblaciones = this.todasPoblaciones.filter(
      p => p.provincia_id === provinciaId
    );
  }


  /**
   * Gestiona el alta de nuevos usuarios.
   * Define valores por defecto de la plataforma (saldo inicial de 5 horas y rol de usuario).
   * Al completarse, inicia automáticamente la sesión del usuario.
   */
  registrar() {

    const nuevoUsuario = new FormData();
    nuevoUsuario.append('id', '0');
    nuevoUsuario.append('nombre', this.nombre);
    nuevoUsuario.append('apellido', this.apellidos);
    nuevoUsuario.append('email', this.mail);
    nuevoUsuario.append('provincia_id', String(this.provincia));
    nuevoUsuario.append('ciudad_id', String(this.ciudad));
    nuevoUsuario.append('descripcion', '');
    // Lógica de negocio: Todo nuevo usuario comienza con una dotación de 5 horas de tiempo
    nuevoUsuario.append('horas_saldo', '5');
    nuevoUsuario.append('valoracion', '0');
    if (this.imagen) {
      nuevoUsuario.append('img', this.imagen);
    }
    // Asignación de rol estándar (Usuario)
    nuevoUsuario.append('rol_id', '3');
    nuevoUsuario.append('password', this.password1);
    nuevoUsuario.append('direccion', this.direccion);

    this._usuariosService.createUsuario(nuevoUsuario).subscribe({
      next: (response: LoginResponse) => {
        // Persistencia automática de la sesión tras el registro exitoso
        localStorage.setItem('access_token', response.access_token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        this.resetForm();
        window.alert('Usuario creado con éxito, se le redireccionará a la sección de ofertas.');
        this._router.navigate(['/ofertas']);        
      },
      error: (error) => {
        console.error("Error al crear al usuario:", error);
      } 
    });
    
  }

  // Limpia el estado del formulario
  resetForm() {
    this.nombre = '';
    this.apellidos = '';
    this.mail = '';
    this.provincia = null;
    this.ciudad = '';
    this.password1 = '';
    this.password2 = '';
    this.direccion = '';
  }

  // Normaliza el formato de texto para nombres y apellidos (ej: "juan pérez" -> "Juan Pérez")
  capitalizar(texto: string): string {
    if (!texto) return '';
    return texto
      .trim()
      .toLowerCase()
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  // Captura el archivo imagen de perfil para su posterior envío
  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
  }

}