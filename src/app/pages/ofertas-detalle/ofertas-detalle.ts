import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicios } from '../../models/servicios';
import { ModalComponent } from '../../components/modal/modal';
import { ApiResponse } from '../../models/apiresponse';
import { ServiciosService } from '../../services/servicios.service';
import { Usuario } from '../../models/usuarios';
import { UsuariosService } from '../../services/usuarios.service';
import { Mensaje } from '../../models/mensaje';
import { MensajesService } from '../../services/mensajes.service';
import { FormsModule } from '@angular/forms';
import { TransaccionesService } from '../../services/transacciones.service';

@Component({
  selector: 'app-ofertas-detalle',
  standalone: true,
  imports: [CommonModule, Header, Footer, Button, ModalComponent, FormsModule],
  templateUrl: './ofertas-detalle.html',
  styleUrl: './ofertas-detalle.scss',
})

export class OfertasDetalle implements OnInit {
  
  public oferta : Servicios | null = null;
  public isAceptarModalOpen: boolean = false;
  public isContactarModalOpen: boolean = false;
  public usuario: Usuario | null = null;
  public nuevoMensaje: string = '';
  protected Math = Math;
  
  ngOnInit() {
    const userAlmacenado = sessionStorage.getItem('user');
        if (userAlmacenado) {
            this.usuario = JSON.parse(userAlmacenado);
        }
        console.log(userAlmacenado);
    const idStr = this._activRoute.snapshot.paramMap.get('id');
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
    this.isAceptarModalOpen = false; 
    this._router.navigate(['/ofertas']);
  }

  constructor(private _activRoute: ActivatedRoute, private _serviciosService: ServiciosService, private _router: Router,
    private _usuariosService: UsuariosService, private _mensajesService: MensajesService, 
    private _transaccionesService: TransaccionesService ) {}

  loadServiceById(id: number) {
    this._serviciosService.getServiciosById(id).subscribe({
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
    if (!this.oferta || !this.usuario) return;

    const saldoActual = Number(this.usuario.horas_saldo);
    const horasOferta = Number(this.oferta.horas_estimadas);
    const nuevoSaldo = saldoActual - horasOferta;

    if (nuevoSaldo < 0) {
      window.alert(`No tienes saldo suficiente. Dispones de ${saldoActual}h y necesitas ${horasOferta}h.`);
      return;
    }

    const ofertaData = new FormData();
    ofertaData.append('estado', 'en_proceso');

    this._serviciosService.updateServicio(this.oferta.id, ofertaData).subscribe({
      next: (resOferta) => {
        console.log('1. Oferta actualizada a en_proceso');
        
        this.ejecutarRestaDeHoras(nuevoSaldo);
        this.crearTransaccion();
      },
      error: (err) => {
        console.error('Error al actualizar oferta:', err);
        alert('Hubo un error al aceptar la oferta.');
      }
    });
  }

  private ejecutarRestaDeHoras(nuevoSaldo: number) {
    const userData = new FormData();
    userData.append('horas_saldo', String(nuevoSaldo)); 

    this._usuariosService.updateUsuario(this.usuario!.id, userData).subscribe({
      next: (resUser) => {
        console.log('2. Saldo actualizado en el servidor:', nuevoSaldo);
        this.usuario!.horas_saldo = nuevoSaldo;
        sessionStorage.setItem('user', JSON.stringify(this.usuario));

        this._usuariosService.notificarCambioSaldo();
        this.mensajeConfirmacion();

        this.isAceptarModalOpen = true;
      },
      error: (err) => {
        console.error('Error al actualizar el saldo del usuario:', err);
        alert('La oferta se aceptó, pero hubo un problema al descontar las horas.');
      }
    });
  }

  crearTransaccion(): void {
    const nuevaTransaccion = {
      id: 0,
      servicio_id: this.oferta!.id,
      usuario_solicitante_id: this.usuario!.id,
      usuario_ofertante_id: this.oferta!.usuario_id,
      horas: this.oferta!.horas_estimadas,
      estado: 'pendiente',
      fecha_confirmacion: null,
    };    

    this._transaccionesService.createTransaccion(nuevaTransaccion).subscribe({
      next: (response) => {
        console.log('Transacción creada:', response);
      },
      error: (err) => {
        console.error('Error al crear la transacción:', err);
      }
    });
  }

  enviarMensaje(): void {
    const nuevo: Mensaje = {
            id: 0,
            emisor_id: this.usuario!.id,
            receptor_id: this.oferta!.usuario_id,
            servicio_id: this.oferta!.id,
            mensaje: this.nuevoMensaje,
            leido: false,
            created_at: new Date().toISOString()
    };
    console.log("Mensaje a enviar:", nuevo);
    this._mensajesService.createMensaje(nuevo).subscribe({
      next: (response: ApiResponse<Mensaje>) => {
          console.log('Mensaje publicado:', response.message);                    
          this.nuevoMensaje = '';
      },
      error: (err) => {
          console.error('Error al publicar el mensaje:', err);
      }
    });
    this.isContactarModalOpen = false;    
  }

  mensajeConfirmacion() {
    const nuevo: Mensaje = {
            id: 0,
            emisor_id: this.usuario!.id,
            receptor_id: this.oferta!.usuario_id,
            servicio_id: this.oferta!.id,
            mensaje: "Oferta Aceptada",
            leido: false,
            created_at: new Date().toISOString()
    };
    console.log("Mensaje a enviar:", nuevo);
    this._mensajesService.createMensaje(nuevo).subscribe({
      next: (response: ApiResponse<Mensaje>) => {
          console.log('Mensaje publicado:', response.message);                    
          this.nuevoMensaje = '';
      },
      error: (err) => {
          console.error('Error al publicar el mensaje:', err);
      }
    });
  }

}
