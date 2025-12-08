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

  constructor(private _ubicacionesService : UbicacionesService, private _router : Router) {}

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
  public provincia : number = 0;
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


onProvinciaChange() {
  this.ciudad = '';  
  const provinciaIdSeleccionada = this.provincia; 

  if (provinciaIdSeleccionada) {
      this.poblaciones = this.todasPoblaciones.filter(p => {
          return p.provincia_id === provinciaIdSeleccionada;
      });
      
  } else {
      this.poblaciones = [];
  }  
  console.log(`Poblaciones filtradas para ID ${provinciaIdSeleccionada}:`, this.poblaciones);
}



registrar() {
}

}
