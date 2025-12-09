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
        console.log('Todas las poblaciones cargadas:', this.todasPoblaciones);
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

    const nuevoUsuario : Usuario = {
      id : 0,
      nombre : this.nombre,
      apellido : this. apellidos,
      email : this.mail,
      provincia_id: Number(this.provincia),
      ciudad_id: Number(this.ciudad),
      descripcion: '',
      horas_saldo: 5,
      valoracion: 0,
      rol_id: 3,
      password: this.password1,
      direccion: this.direccion,
    };

    this._usuariosService.createUsuario(nuevoUsuario).subscribe({
      next: (response: ApiResponse<LoginResponse>) => {
        this.resetForm();
        this._router.navigate(['/ofertas']);
      },
      error: (error) => {
        console.error("Error al crear el seguimiento:", error);
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



}
