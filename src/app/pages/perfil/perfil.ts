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
  }

  constructor(private _ubicacionesService: UbicacionesService) { }

  public provincias: Provincias[] = [];
  public poblaciones: Poblaciones[] = [];
  public todasPoblaciones: Poblaciones[] = [];
  
  public password1 : string = '';
  public password2 : string = '';
  public direccion : string = '';
  public provincia: number | null = null;
  public ciudad : number | null = null;

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
