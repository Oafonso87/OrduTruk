import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicios } from '../../models/servicios';
import { ModalComponent } from '../../components/modal/modal';
import { ServiciosService } from '../../services/servicios.service';
import { Usuario } from '../../models/usuarios';

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
  public usuario: Usuario | null = null;
  
  ngOnInit() {
    const userAlmacenado = sessionStorage.getItem('user');
        if (userAlmacenado) {
            this.usuario = JSON.parse(userAlmacenado);
        }
        console.log(userAlmacenado);
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

  finalizarYAceptar() {
    this.isAceptarModalOpen = false; // Cierras el modal
    this._router.navigate(['/ofertas']); // Rediriges a la lista
  }

  constructor(private activRoute: ActivatedRoute, private serviciosService: ServiciosService, private _router: Router) {}

  loadServiceById(id: number) {
    this.serviciosService.getServiciosById(id).subscribe({
      next: (response) => {
        this.oferta = response.data;
        console.log(this.oferta);
      },
      error: (error) => {
        console.error('Error al cargar la oferta:', error);
      }
    });
  }

  aceptarOferta(): void {
    if (!this.oferta) return;

    if (this.usuario!.horas_saldo < this.oferta.horas_estimadas) {
        window.alert(
            `No tienes saldo suficiente. \n` +
            `Saldo disponible: ${this.usuario!.horas_saldo}h \n` +
            `Costo de la oferta: ${this.oferta.horas_estimadas}h`
        );
        return;
    }

    // 1. Creamos el objeto con el estado actualizado
    const ofertaActualizada = { ...this.oferta, estado: 'en_proceso' };

    // // 2. Llamamos al servicio
    // this.serviciosService.updateServicio(ofertaActualizada, ofertaActualizada.id).subscribe({
    //   next: (res) => {
    //     console.log('Oferta actualizada con éxito');
    //     this.isAceptarModalOpen = true;
    //   },
    //   error: (err) => {
    //     console.error('Error al actualizar la oferta:', err);
    //     alert('No se pudo aceptar la oferta en este momento.');
    //   }
    // });
  }
  
}
