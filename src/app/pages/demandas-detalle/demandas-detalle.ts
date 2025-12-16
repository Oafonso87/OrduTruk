import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { Servicios } from '../../models/servicios';

@Component({
  selector: 'app-demandas-detalle',
  standalone: true,
  imports: [CommonModule, Header, Footer, Button],
  templateUrl: './demandas-detalle.html',
  styleUrl: './demandas-detalle.scss',
})

export class DemandasDetalle implements OnInit {
  
  public demanda : Servicios | null = null;
  
  ngOnInit() {
    const almacenada = sessionStorage.getItem('demandaSeleccionada');
    if (almacenada) {
      this.demanda = JSON.parse(almacenada);
    }
    console.log(almacenada);
  }

  

  constructor() {}
  
}
