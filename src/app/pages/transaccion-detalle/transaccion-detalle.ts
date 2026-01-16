import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { FormsModule } from '@angular/forms';
import { TransaccionesService } from '../../services/transacciones.service';
import { Transacciones } from '../../models/transacciones';
import { ApiResponse } from '../../models/apiresponse';
import { Valoraciones } from '../../models/valoraciones';
import { ValoracionesService } from '../../services/valoraciones.service';
import { Usuario } from '../../models/usuarios';
import { ServiciosService } from '../../services/servicios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Mensaje } from '../../models/mensaje';
import { MensajesService } from '../../services/mensajes.service';

@Component({
    selector: 'app-transaccion-detalle',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule, Button, RouterLink],
    templateUrl: './transaccion-detalle.html',
    styleUrl: './transaccion-detalle.scss',
})

export class TransaccionDetalle implements OnInit {
    
    public id: number | null = null;
    public transaccion: Transacciones | null = null;
    public usuarioLogueado: Usuario | null = null;
    public puntuacionSeleccionada: number = 0;
    public nuevoMensaje: string = '';



    constructor( private readonly route: ActivatedRoute, private _transaccionesService: TransaccionesService,
        private _valoracionesService: ValoracionesService, private _serviciosService: ServiciosService,
        private _usuariosService: UsuariosService, private _router: Router, private _mensajesService : MensajesService) {}    
        

    ngOnInit() {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            this.usuarioLogueado = JSON.parse(userStr);
            // Aseguramos el tipado numérico del ID para comparaciones lógicas posteriores
            this.usuarioLogueado!.id = Number(this.usuarioLogueado!.id);
        }

        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = Number(idParam);
            this.loadTransaccion();
        }
    }

    // Gestiona la selección visual de estrellas para la valoración
    setRating(valor: number) {
        this.puntuacionSeleccionada = valor;
    }

    // Recupera la transacción específica filtrando sobre el listado del usuario
    loadTransaccion() {    
        this._transaccionesService.getTransacciones().subscribe({
            next: (response: ApiResponse<Transacciones[]>) => {

                const encontrada = response.data.find(t => t.id === this.id);

                if (encontrada) {
                    this.transaccion = encontrada;
                } else {
                    console.warn('No se encontró la transacción ' + this.id + ' en la lista del usuario.');
                }
            },
            error: (err) => console.error('Error al conectar con la API:', err)
        });
    }

    /**
   * Registra una valoración personalizada en el servidor.
   * Vincula la puntuación visual seleccionada con el comentario del formulario
   * para evaluar el desempeño del usuario que prestó el servicio.
   */
    enviarValoracion(valoracion: Valoraciones) {
        const nuevaValoracion : Valoraciones = {
            transaccion_id: this.id!,
            valorador_id: this.usuarioLogueado!.id!,
            valorado_id: this.transaccion!.usuario_ofertante_id!,
            puntuacion: this.puntuacionSeleccionada,
            comentario: valoracion.comentario
        }

        this._valoracionesService.createValoracion(nuevaValoracion).subscribe({
            next: (response: ApiResponse<Valoraciones>) => {
            },
            error: (err) => console.error('Error al enviar valoración:', err)
        });
    }

    /**
     * Orquesta el cierre de una transacción.
     * Realiza tres acciones en cascada: confirma la transacción, finaliza el servicio 
     * y transfiere efectivamente el saldo de horas al voluntario.
     */
    aceptarOferta() {
        if (this.puntuacionSeleccionada === 0) {
            alert('Por favor, selecciona una puntuación antes de completar.');
            return;
        }

        if (!confirm('¿Confirmas que el servicio se ha realizado correctamente? Se transferirán las horas al voluntario.')) return;

        // Actualizamos el estado de la transacción a confirmado
        const datosT = { ...this.transaccion, estado: 'confirmado', fecha_confirmacion: new Date().toISOString() };
        
        this._transaccionesService.updateTransaccion(datosT).subscribe({
            next: () => {
                // Cerramos el servicio asociado para que desaparezca de las tareas pendientes
                const fdServicio = new FormData();
                fdServicio.append('estado', 'finalizado');
                fdServicio.append('_method', 'PUT');

                this._serviciosService.updateServicio(this.transaccion!.servicio_id, fdServicio).subscribe({
                    next: () => {
                        // Ejecutamos la transferencia de saldo según el tipo de flujo (Oferta o Demanda)
                        // Si es una Oferta, el usuario que publicó (ofertante) recibe las horas
                        if (this.transaccion?.servicio?.tipo === "oferta") {
                            const fdUsuario = new FormData();
                            const saldoActualOfertante = Number(this.transaccion?.usuario_ofertante?.horas_saldo || 0);
                            const nuevoSaldo = saldoActualOfertante + Number(this.transaccion?.horas);
                            
                            fdUsuario.append('horas_saldo', nuevoSaldo.toString());
                            fdUsuario.append('_method', 'PUT');

                            this._usuariosService.updateUsuario(this.transaccion!.usuario_ofertante_id, fdUsuario).subscribe({
                                next: () => {
                                    // Sincronización de estado local y notificaciones
                                    this.transaccion!.usuario_ofertante!.horas_saldo = nuevoSaldo;
                                    sessionStorage.setItem('user', JSON.stringify(this.transaccion!.usuario_ofertante!));
                                    this._usuariosService.notificarCambioSaldo();
                                    this.mensajeConfirmacion();                                
                                    this.enviarValoracionFinal();
                                },
                                error: (err) => console.error('Error al pagar horas:', err)
                            });
                        // Si es una Demanda, el usuario que aceptó ayudar (solicitante) recibe las horas    
                        } else if (this.transaccion?.servicio?.tipo === "demanda") {
                            const fdUsuario = new FormData();
                            const saldoActualOfertante = Number(this.transaccion?.usuario_solicitante?.horas_saldo || 0);
                            const nuevoSaldo = saldoActualOfertante + Number(this.transaccion?.horas);
                            
                            fdUsuario.append('horas_saldo', nuevoSaldo.toString());
                            fdUsuario.append('_method', 'PUT');

                            this._usuariosService.updateUsuario(this.transaccion!.usuario_solicitante_id, fdUsuario).subscribe({
                                next: () => {      
                                    this.transaccion!.usuario_solicitante!.horas_saldo = nuevoSaldo;
                                    sessionStorage.setItem('user', JSON.stringify(this.transaccion!.usuario_solicitante!));
                                    this._usuariosService.notificarCambioSaldo(); 
                                    this.mensajeConfirmacion();                             
                                    this.enviarValoracionFinal();
                                },
                                error: (err) => console.error('Error al pagar horas:', err)
                            });
                        }
                    },
                    error: (err) => console.error('Error al finalizar servicio:', err)
                });
            },
            error: (err) => console.error('Error al confirmar transacción:', err)
        });
    }

    /**
     * Registra la valoración final del intercambio. 
     * Invierte dinámicamente los roles de 'valorador' y 'valorado' dependiendo de 
     * quién prestó el servicio originalmente.
     */
    private enviarValoracionFinal() {
        let nuevaValoracion: Valoraciones | null = null;
        if(this.transaccion?.servicio?.tipo === "oferta") {
            nuevaValoracion = {
                transaccion_id: this.id!,
                valorador_id: this.transaccion!.usuario_solicitante_id,
                valorado_id: this.transaccion!.usuario_ofertante_id,
                puntuacion: this.puntuacionSeleccionada,
                comentario: ""
            };
        } else if (this.transaccion?.servicio?.tipo === "demanda") {
            nuevaValoracion = {
                transaccion_id: this.id!,
                valorador_id: this.transaccion!.usuario_ofertante_id,
                valorado_id: this.transaccion!.usuario_solicitante_id,
                puntuacion: this.puntuacionSeleccionada,
                comentario: ""
            };  
        }

        this._valoracionesService.createValoracion(nuevaValoracion!).subscribe({
            next: () => {
                alert('¡Transacción finalizada con éxito! Horas enviadas y voluntario valorado.');
                this._router.navigate(['/perfil']);
            },
            error: (err) => {
                console.error('Error en valoración:', err);
                this._router.navigate(['/perfil']);
            }
        });
    }

    /**
     * Revierte una transacción en curso.
     * Cancela el intercambio, devuelve el servicio al estado 'activo' para que otros 
     * puedan verlo y reintegra las horas retenidas al usuario que las "pagó".
     */
    rechazar() {
        if (!confirm('¿Estás seguro de que quieres cancelar esta transacción? El servicio volverá a estar activo.')) return;

        // Marcamos la transacción como cancelada en la base de datos
        const datosT = { ...this.transaccion, estado: 'cancelado' };
        
        this._transaccionesService.updateTransaccion(datosT).subscribe({
            next: () => {
                // Liberamos el servicio para que vuelva a aparecer en los listados públicos
                const fdServicio = new FormData();
                fdServicio.append('estado', 'activo');
                fdServicio.append('_method', 'PUT');

                this._serviciosService.updateServicio(this.transaccion!.servicio_id, fdServicio).subscribe({
                    next: () => {
                        // Reintegro de horas: Identificamos quién debe recuperar su saldo según el tipo de servicio                        
                        // Si era una Oferta, el solicitante recupera sus horas
                        if (this.transaccion?.servicio?.tipo === "oferta"){
                            const fdUsuario = new FormData();
                            const saldoActual = Number(this.transaccion.usuario_solicitante!.horas_saldo || 0);
                            const horasADevolver = Number(this.transaccion?.horas);
                            const nuevoSaldo = saldoActual + horasADevolver;
                            
                            fdUsuario.append('horas_saldo', nuevoSaldo.toString());
                            fdUsuario.append('_method', 'PUT');

                            this._usuariosService.updateUsuario(this.transaccion.usuario_solicitante!.id, fdUsuario).subscribe({
                                next: () => {
                                    // Sincronizamos estado local y notificamos el cambio de saldo al Header
                                    this.transaccion!.usuario_solicitante!.horas_saldo = nuevoSaldo;
                                    sessionStorage.setItem('user', JSON.stringify(this.transaccion!.usuario_solicitante!));
                                    this._usuariosService.notificarCambioSaldo();

                                    alert('Transacción cancelada. Las horas han sido devueltas a tu saldo y el servicio vuelve a estar disponible.');
                                    this._router.navigate(['/perfil']);
                                },
                                error: (err) => console.error('Error al devolver horas:', err)
                            });
                        }else {
                            // Caso de Demanda: Solo notificamos la reactivación del servicio
                            alert('Transacción cancelada. El servicio vuelve a estar disponible.');
                            this._router.navigate(['/perfil']);
                        }
                    },    
                    error: (err) => console.error('Error al reactivar servicio:', err)
                });
            },
            error: (err) => console.error('Error al cancelar transacción:', err)
        });
    }

    /**
     * Genera una notificación automática en el sistema de mensajería interna.
     * Identifica los roles de emisor y receptor según el tipo de flujo (Oferta/Demanda)
     * para dejar constancia del cierre de la transacción en el chat correspondiente.
     */
    mensajeConfirmacion() {
        let nuevo : Mensaje | null = null;
        // En una Oferta, el mensaje se genera del Solicitante hacia el Ofertante
        if (this.transaccion?.servicio?.tipo === "oferta") {
            nuevo = {
                    id: 0,
                    emisor_id: this.transaccion.usuario_solicitante_id,
                    receptor_id: this.transaccion.usuario_ofertante_id,
                    servicio_id: this.transaccion.servicio_id,
                    mensaje: "Transacción completada.",
                    leido: false,
                    created_at: new Date().toISOString()
            };
        // En una Demanda, el flujo se invierte para mantener la coherencia del hilo    
        } else if (this.transaccion?.servicio?.tipo === "demanda") {
            nuevo = {
                    id: 0,
                    emisor_id: this.transaccion.usuario_ofertante_id,
                    receptor_id: this.transaccion.usuario_solicitante_id,
                    servicio_id: this.transaccion.servicio_id,
                    mensaje: "Transacción completada.",
                    leido: false,
                    created_at: new Date().toISOString()
            };
        }
        // Persistencia de la notificación en la base de datos
        this._mensajesService.createMensaje(nuevo!).subscribe({
            next: (response: ApiResponse<Mensaje>) => {
            },
            error: (err) => {
                console.error('Error al publicar el mensaje:', err);
            }
        });
    }  
    
}