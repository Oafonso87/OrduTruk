import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.scss'
})

export class OfertasComponent implements OnInit {

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