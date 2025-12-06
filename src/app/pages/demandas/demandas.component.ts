import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demandas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demandas.component.html',
  styleUrl: './demandas.component.scss'
})

export class DemandasComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor() { }

  public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';


}