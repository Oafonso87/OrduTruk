import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { Button } from '../../components/button/button';
import { Header } from "../../components/header/header";
import { Footer } from '../../components/footer/footer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Button, Header, Footer, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(private titulo: Title) {
    this.titulo.setTitle("OrduTruk");
  }

  // public vistaActual: 'index' | 'descripcion' | 'registrar' | 'acceder' = 'index';
  // public usuarios: Usuario[] = [];

  // public nombreRegistro: string = '';
  // public apellidosRegistro: string = '';
  // public mailRegistro: string = '';
  // public passwordRegistro: string = '';
  // public direccionRegistro: string = '';





  // loadUsuario() {
  //   this._usuariosService.getUsuarios().subscribe({
  //     next: (response: ApiResponse<Usuario[]>) => {
  //       this.usuarios = response.data;
  //       console.log("Estos son los usuarios", this.usuarios);
  //     },
  //     error: (error) => {
  //       console.error("Error al cargar los usuarios:", error);
  //     }
  //   });
  // }

  // registrarse() {
  //   let nuevoUsuario: Usuario = {
  //     id: 0,
  //     nombre: this.nombreRegistro,
  //     apellidos: this.apellidosRegistro,
  //     mail: this.mailRegistro,
  //     password: this.passwordRegistro,
  //     direccion: this.direccionRegistro
  //   }

  // }

  // acceder() {

  // }

  // resetForm() {
  //   this.nombreRegistro = '';
  //   this.apellidosRegistro = '';
  //   this.mailRegistro = '';
  //   this.passwordRegistro = '';
  //   this.direccionRegistro = '';
  // }

}