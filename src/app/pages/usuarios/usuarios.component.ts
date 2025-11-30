import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor() { }

  // public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';


}