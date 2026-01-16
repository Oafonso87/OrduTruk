import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  selector: 'app-demandas-detalle',
  standalone: true,
  imports: [CommonModule, Header, Footer, Button, ModalComponent, FormsModule, RouterLink],
  templateUrl: './demandas-detalle.html',
  styleUrl: './demandas-detalle.scss',
})

export class DemandasDetalle implements OnInit {
  
  public demanda : Servicios | null = null;
  public isAceptarModalOpen: boolean = false;
  public isContactarModalOpen: boolean = false;
  public usuario: Usuario | null = null;
  public nuevoMensaje: string = '';
  protected Math = Math;

  
  ngOnInit() {
    // Recuperamos el usuario en sesión
    const userAlmacenado = sessionStorage.getItem('user');
        if (userAlmacenado) {
            this.usuario = JSON.parse(userAlmacenado);
        }
    // Captura del ID de la demanda desde la URL para cargar su información específica    
    const idStr = this._activRoute.snapshot.paramMap.get('id');
    if (idStr) {
      const id = parseInt(idStr);
      this.loadServiceById(id);
    }
  }

  // Métodos para el control de visibilidad de los componentes modales
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
    this._router.navigate(['/demandas']);
  }

  constructor(private _activRoute: ActivatedRoute, private _serviciosService: ServiciosService, private _router: Router,
    private _usuariosService: UsuariosService, private _mensajesService: MensajesService, 
    private _transaccionesService: TransaccionesService ) {}
  
  loadServiceById(id: number) {
    this._serviciosService.getServiciosById(id).subscribe({
      next: (response) => {
        this.demanda = response.data;
      },
      error: (error) => {
        console.error('Error al cargar la demanda:', error);
      }
    });
  }

  /**
   * Procesa la aceptación de una demanda. 
   * Cambia el estado del servicio a 'en_proceso' para retirarlo de la lista activa
   * e inicia la creación de la transacción y notificación automática.
   */
  aceptarDemanda(): void {
    if (!this.demanda || !this.usuario) return;

    const saldoActual = Number(this.usuario.horas_saldo);
    const horasOferta = Number(this.demanda.horas_estimadas);
    

    const ofertaData = new FormData();
    ofertaData.append('estado', 'en_proceso');

    this._serviciosService.updateServicio(this.demanda.id, ofertaData).subscribe({
      next: (resDemanda) => {
        this.isAceptarModalOpen = true;
        this.mensajeConfirmacion();
        this.crearTransaccion();
      },
      error: (err) => {
        console.error('Error al actualizar demanda:', err);
        alert('Hubo un error al aceptar la demanda.');
      }
    });
  }

  // Registra una nueva transacción en estado 'pendiente' vinculando a ambos usuarios y el servicio
  crearTransaccion(): void {
    const nuevaTransaccion = {
      id: 0,
      servicio_id: this.demanda!.id,
      usuario_solicitante_id: this.usuario!.id,
      usuario_ofertante_id: this.demanda!.usuario_id,
      horas: this.demanda!.horas_estimadas,
      estado: 'pendiente',
      fecha_confirmacion: null,
    };    

    this._transaccionesService.createTransaccion(nuevaTransaccion).subscribe({
      next: (response) => {
      },
      error: (err) => {
        console.error('Error al crear la transacción:', err);
      }
    });
  }

  // Envía un mensaje manual redactado por el usuario a través del modal de contacto
  enviarMensaje(): void {
    const nuevo: Mensaje = {
            id: 0,
            emisor_id: this.usuario!.id,
            receptor_id: this.demanda!.usuario_id,
            servicio_id: this.demanda!.id,
            mensaje: this.nuevoMensaje,
            leido: false,
            created_at: new Date().toISOString()
    };
    this._mensajesService.createMensaje(nuevo).subscribe({
      next: (response: ApiResponse<Mensaje>) => {
          this.nuevoMensaje = '';
          window.alert('Mensaje enviado correctamente.');
      },
      error: (err) => {
          console.error('Error al publicar el mensaje:', err);
      }
    });
    this.isContactarModalOpen = false;    
  }  

  // Genera un mensaje automático de sistema para notificar que la demanda ha sido aceptada formalmente
  mensajeConfirmacion() {
    const nuevo: Mensaje = {
            id: 0,
            emisor_id: this.usuario!.id,
            receptor_id: this.demanda!.usuario_id,
            servicio_id: this.demanda!.id,
            mensaje: "Demanda Aceptada",
            leido: false,
            created_at: new Date().toISOString()
    };
    this._mensajesService.createMensaje(nuevo).subscribe({
      next: (response: ApiResponse<Mensaje>) => {
          this.nuevoMensaje = '';
      },
      error: (err) => {
          console.error('Error al publicar el mensaje:', err);
      }
    });
  }
  
}