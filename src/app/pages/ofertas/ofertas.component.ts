import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.scss'
})

export class OfertasComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor() { }

  public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';


}