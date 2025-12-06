import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-demandas',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './demandas.component.html',
  styleUrl: './demandas.component.scss'
})

export class DemandasComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor() { }


  public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';
  public mostrarFiltro: boolean = false;

  // Array para repetir ofertas 6 veces
  public ofertas = Array(6).fill(0);

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }
}