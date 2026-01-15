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
  // imports: [Button, Header, Footer, RouterLink, FormsModule],
  imports: [ Header, Footer, RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro implements OnInit {

  ngOnInit(): void {
    this.loadProvincias();
    this.loadTodasPoblaciones();  
  }

  constructor(private _ubicacionesService : UbicacionesService, private _router : Router, private _usuariosService : UsuariosService) {}

  public usuarios: Usuario[] = [];
  public provincias: Provincias[] = [];
  public poblaciones: Poblaciones[] = [];
  public todasPoblaciones: Poblaciones[] = [];
  
  public nombre : string = '';
  public apellidos : string = '';
  public mail : string = '';
  public password1 : string = '';
  public password2 : string = '';
  public direccion : string = '';
  public provincia: number | null = null;
  public ciudad : string = '';
  public imagen: File | null = null;

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

  onProvinciaChange(valor: any) {
    const provinciaId = Number(valor);   
    this.provincia = provinciaId;
    this.ciudad = '';

    this.poblaciones = this.todasPoblaciones.filter(
      p => p.provincia_id === provinciaId
    );
  }


  registrar() {

    const nuevoUsuario = new FormData();
    nuevoUsuario.append('id', '0');
    nuevoUsuario.append('nombre', this.nombre);
    nuevoUsuario.append('apellido', this.apellidos);
    nuevoUsuario.append('email', this.mail);
    nuevoUsuario.append('provincia_id', String(this.provincia));
    nuevoUsuario.append('ciudad_id', String(this.ciudad));
    nuevoUsuario.append('descripcion', '');
    nuevoUsuario.append('horas_saldo', '5');
    nuevoUsuario.append('valoracion', '0');
    if (this.imagen) {
      nuevoUsuario.append('img', this.imagen);
    }
    nuevoUsuario.append('rol_id', '3');
    nuevoUsuario.append('password', this.password1);
    nuevoUsuario.append('direccion', this.direccion);

    this._usuariosService.createUsuario(nuevoUsuario).subscribe({
      next: (response: LoginResponse) => {
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

  capitalizar(texto: string): string {
    if (!texto) return '';
    return texto
      .trim()
      .toLowerCase()
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
  }

}