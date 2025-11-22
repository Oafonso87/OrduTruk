import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  providers: []
})

export class UsuariosComponent implements OnInit {
    
    ngOnInit(): void {      
    }

    constructor() {}

    // public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';


}