import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { UsuariosService } from '../../services/usuarios.service';

import { ApiResponse } from '../../models/apiresponse';
import { Usuarios } from '../../models/usuarios';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [UsuariosService]
})

export class HomeComponent implements OnInit {
    
    ngOnInit(): void { 
      
    this.loadUsuario();
    }

    constructor(private _usuariosService : UsuariosService,  private titulo:Title) {
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