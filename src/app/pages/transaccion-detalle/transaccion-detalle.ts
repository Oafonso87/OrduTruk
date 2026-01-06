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


    constructor( private readonly route: ActivatedRoute, private _transaccionesService: TransaccionesService,
        private _valoracionesService: ValoracionesService, private _serviciosService: ServiciosService,
        private _usuariosService: UsuariosService, private _router: Router) {}    
        

    ngOnInit() {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            this.usuarioLogueado = JSON.parse(userStr);
            this.usuarioLogueado!.id = Number(this.usuarioLogueado!.id); // <--- CLAVE
        }

        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = Number(idParam);
            this.loadTransaccion();
        }
    }


    setRating(valor: number) {
        this.puntuacionSeleccionada = valor;
        console.log('Puntuación elegida:', this.puntuacionSeleccionada);
    }

    loadTransaccion() {    
        this._transaccionesService.getTransacciones().subscribe({
            next: (response: ApiResponse<Transacciones[]>) => {
                console.log('Lista recibida para filtrar:', response.data);

                const encontrada = response.data.find(t => t.id === this.id);

                if (encontrada) {
                    this.transaccion = encontrada;
                    console.log('Transacción encontrada y asignada:', this.transaccion);
                } else {
                    console.warn('No se encontró la transacción ' + this.id + ' en la lista del usuario.');
                }
            },
            error: (err) => console.error('Error al conectar con la API:', err)
        });
    }

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
                console.log('Valoración enviada:', response.data);
            },
            error: (err) => console.error('Error al enviar valoración:', err)
        });
    }

    aceptarOferta() {
        if (this.puntuacionSeleccionada === 0) {
            alert('Por favor, selecciona una puntuación antes de completar.');
            return;
        }

        if (!confirm('¿Confirmas que el servicio se ha realizado correctamente? Se transferirán las horas al voluntario.')) return;

        
        const datosT = { ...this.transaccion, estado: 'confirmado', fecha_confirmacion: new Date().toISOString() };
        
        this._transaccionesService.updateTransaccion(datosT).subscribe({
            next: () => {
                const fdServicio = new FormData();
                fdServicio.append('estado', 'finalizado');
                fdServicio.append('_method', 'PUT');

                this._serviciosService.updateServicio(this.transaccion!.servicio_id, fdServicio).subscribe({
                    next: () => {
                        const fdUsuario = new FormData();
                        const saldoActualOfertante = Number(this.transaccion?.usuario_ofertante?.horas_saldo || 0);
                        const nuevoSaldo = saldoActualOfertante + Number(this.transaccion?.horas);
                        
                        fdUsuario.append('horas_saldo', nuevoSaldo.toString());
                        fdUsuario.append('_method', 'PUT');

                        this._usuariosService.updateUsuario(this.transaccion!.usuario_ofertante_id, fdUsuario).subscribe({
                            next: () => {                                
                                this.enviarValoracionFinal();
                            },
                            error: (err) => console.error('Error al pagar horas:', err)
                        });
                    },
                    error: (err) => console.error('Error al finalizar servicio:', err)
                });
            },
            error: (err) => console.error('Error al confirmar transacción:', err)
        });
    }

    private enviarValoracionFinal() {
        const nuevaValoracion: Valoraciones = {
            transaccion_id: this.id!,
            valorador_id: this.usuarioLogueado!.id,
            valorado_id: this.transaccion!.usuario_ofertante_id,
            puntuacion: this.puntuacionSeleccionada,
            comentario: ""
        };

        this._valoracionesService.createValoracion(nuevaValoracion).subscribe({
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

    rechazar() {
        if (!confirm('¿Estás seguro de que quieres cancelar esta transacción? El servicio volverá a estar activo.')) return;

        const datosT = { ...this.transaccion, estado: 'cancelado' };
        
        this._transaccionesService.updateTransaccion(datosT).subscribe({
            next: () => {
                const fdServicio = new FormData();
                fdServicio.append('estado', 'activo');
                fdServicio.append('_method', 'PUT');

                this._serviciosService.updateServicio(this.transaccion!.servicio_id, fdServicio).subscribe({
                    next: () => {
                        const fdUsuario = new FormData();
                        const saldoActual = Number(this.usuarioLogueado!.horas_saldo || 0);
                        const horasADevolver = Number(this.transaccion?.horas);
                        const nuevoSaldo = saldoActual + horasADevolver;
                        
                        fdUsuario.append('horas_saldo', nuevoSaldo.toString());
                        fdUsuario.append('_method', 'PUT');

                        this._usuariosService.updateUsuario(this.usuarioLogueado!.id, fdUsuario).subscribe({
                            next: () => {
                                this.usuarioLogueado!.horas_saldo = nuevoSaldo;
                                sessionStorage.setItem('user', JSON.stringify(this.usuarioLogueado));
                                this._usuariosService.notificarCambioSaldo();

                                alert('Transacción cancelada. Las horas han sido devueltas a tu saldo y el servicio vuelve a estar disponible.');
                                this._router.navigate(['/perfil']);
                            },
                            error: (err) => console.error('Error al devolver horas:', err)
                        });
                    },
                    error: (err) => console.error('Error al reactivar servicio:', err)
                });
            },
            error: (err) => console.error('Error al cancelar transacción:', err)
        });
    }
    
}