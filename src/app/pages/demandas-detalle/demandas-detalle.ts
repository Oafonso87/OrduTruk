import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { Servicios } from '../../models/servicios';
import { ModalComponent } from '../../components/modal/modal';

@Component({
  selector: 'app-demandas-detalle',
  standalone: true,
  imports: [CommonModule, Header, Footer, Button, ModalComponent],
  templateUrl: './demandas-detalle.html',
  styleUrl: './demandas-detalle.scss',
})

export class DemandasDetalle implements OnInit {
  
  public demanda : Servicios | null = null;
  public isModalOpen: boolean = false;
  
  ngOnInit() {
    const almacenada = sessionStorage.getItem('demandaSeleccionada');
    if (almacenada) {
      this.demanda = JSON.parse(almacenada);
    }
    console.log(almacenada);
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  constructor() {}
  
}
