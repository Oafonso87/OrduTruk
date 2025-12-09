import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-ofertas-detalle',
  standalone: true,
  imports: [CommonModule, Header, Footer, Button],
  templateUrl: './ofertas-detalle.html',
  styleUrl: './ofertas-detalle.scss',
})
export class OfertasDetalle implements OnInit {
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
