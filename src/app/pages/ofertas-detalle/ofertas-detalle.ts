import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { ActivatedRoute } from '@angular/router';
import { Servicios } from '../../models/servicios';
import { ModalComponent } from '../../components/modal/modal';
import { ServiciosService } from '../../services/servicios.service';

@Component({
  selector: 'app-ofertas-detalle',
  standalone: true,
  imports: [CommonModule, Header, Footer, Button, ModalComponent],
  templateUrl: './ofertas-detalle.html',
  styleUrl: './ofertas-detalle.scss',
})

export class OfertasDetalle implements OnInit {
  
  public oferta : Servicios | null = null;
  public isAceptarModalOpen: boolean = false;
  public isContactarModalOpen: boolean = false;
  
  ngOnInit() {
    const almacenada = sessionStorage.getItem('ofertaSeleccionada');
    if (almacenada) {
      this.oferta = JSON.parse(almacenada);
    }
    console.log(almacenada);
    const idStr = this.activRoute.snapshot.paramMap.get('id');
    console.log('ID de la oferta desde la ruta:', idStr);
    if (idStr) {
      const id = parseInt(idStr);
      console.log(id);
      this.loadServiceById(id);
    }
  }

  openAceptarModal(): void {
    this.isAceptarModalOpen = true;
  }

  closeAceptarModal(): void {
    this.isAceptarModalOpen = false;
  }

  openContactarModal(): void {
    this.isContactarModalOpen = true;
  }

  closeContactarModal(): void {
    this.isContactarModalOpen = false;
  }

  constructor(private activRoute: ActivatedRoute, private serviciosService: ServiciosService ) {}

  loadServiceById(id: number) {

  }
}
