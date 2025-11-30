import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { UsuariosService } from '../../services/usuarios.service';

import { ApiResponse } from '../../models/apiresponse';
import { Usuarios } from '../../models/usuarios';
import { Button } from '../../components/button/button';
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Button, Header],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

  ngOnInit(): void {

    this.loadUsuario();
  }

  constructor(private _usuariosService: UsuariosService, private titulo: Title) {
    this.titulo.setTitle("Ordutruk");
  }

  public vistaActual: 'index' | 'resumen' | 'registrar' | 'acceder' = 'index';
  public usuarios: Usuarios[] = [];


  loadUsuario() {
    this._usuariosService.getUsuarios().subscribe({
      next: (response: ApiResponse<Usuarios[]>) => {
        this.usuarios = response.data;
        console.log("Estos son los usuarios", this.usuarios);
      },
      error: (error) => {
        console.error("Error al cargar los usuarios:", error);
      }
    });
  }

}