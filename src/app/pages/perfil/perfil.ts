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
        }
        console.log("Este es el usuario " + this.usuario);
    }

    constructor() { }

    public provincias: Provincias[] = [];
    public poblaciones: Poblaciones[] = [];
    public todasPoblaciones: Poblaciones[] = [];

    public mail : string = '';
    public password1 : string = '';
    public password2 : string = '';
    public direccion : string = '';
    public provincia: number | null = null;
    public ciudad : string = '';

    modificar() {}

    onProvinciaChange(valor: any) {
    const provinciaId = Number(valor);   
    this.provincia = provinciaId;
    this.ciudad = '';

    this.poblaciones = this.todasPoblaciones.filter(
      p => p.provincia_id === provinciaId
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


    // toggleFiltro(): void {
    //     this.mostrarFiltro = !this.mostrarFiltro;
    // }


}
