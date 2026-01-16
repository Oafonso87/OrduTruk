import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ModalComponent } from '../../components/modal/modal';
import { Button } from '../../components/button/button';
import { ApiResponse } from '../../models/apiresponse';
import { Mensaje } from '../../models/mensaje';
import { MensajesService } from '../../services/mensajes.service';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuarios';


@Component({
    selector: 'app-mensajes',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule, ModalComponent],
    templateUrl: './mensajes.html',
    styleUrl: './mensajes.scss',
})

export class Mensajes implements OnInit {
    
    public usuario : Usuario | null = null;

    
    ngOnInit(): void {
        const userAlmacenado = sessionStorage.getItem('user');
        if (userAlmacenado) {
            this.usuario = JSON.parse(userAlmacenado);
        }
        this.loadMensajes();
    }

    constructor(private _mensajesService : MensajesService) { }

    // Estructura de array bidimensional para gestionar hilos de conversación agrupados
    public mensajes : Mensaje[] [] = [];
    public activeTab: 'ofertas' | 'demandas' = 'ofertas';
    public activeMessageIndex: number | null = null;
    public isModalOpen: boolean = false;
    public nuevoMensaje: string = '';
    public grupoSeleccionado: Mensaje[] | null = null;

    /**
     * Carga todos los mensajes del usuario y los agrupa por conversación.
     * Una conversación se define por el ID del servicio y el ID del interlocutor.
     */
    loadMensajes() {
        this._mensajesService.getMensajesById(this.usuario!.id).subscribe({
            next: (response: ApiResponse<Mensaje[]>) => {
                const todosLosMensajes = response.data;
                // Lógica de agrupación mediante reduce para crear hilos únicos
                const grupos = todosLosMensajes.reduce((acc: { [key: string]: Mensaje[] }, mensaje) => {
                    const servicioId = mensaje.servicio!.id;
                    // Identificamos quién es la otra persona en la conversación (interlocutor)
                    const interlocutorId = mensaje.emisor!.id === this.usuario!.id 
                        ? mensaje.receptor!.id 
                        : mensaje.emisor!.id;
                    // Creamos una clave única que combina servicio y usuario para agrupar los mensajes
                    const grupoKey = `s${servicioId}_u${interlocutorId}`;

                    if (!acc[grupoKey]) {
                        acc[grupoKey] = [];
                    }
                    acc[grupoKey].push(mensaje);
                    return acc;
                }, {});
                // Convertimos el objeto de grupos en un array de arrays para el renderizado
                this.mensajes = Object.values(grupos);
            },
            error: (err) => {
                console.error('Error al cargar los mensajes:', err);
            }     
        });
    }
    
    // Gestiona el cambio de pestaña entre Ofertas y Demandas
    setActiveTab(tab: 'ofertas' | 'demandas'): void {
        this.activeTab = tab;
        this.activeMessageIndex = null;
    }

    // Expande o colapsa el detalle de una conversación en la lista
    toggleMessage(index: number): void {
        this.activeMessageIndex = this.activeMessageIndex === index ? null : index;
    }    

    // Controladores para la gestión del modal de respuesta
    openModal(grupo: Mensaje[]): void {
        this.grupoSeleccionado = grupo;
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
    }

    public mostrarFiltro: boolean = false;

    toggleFiltro(): void {
        this.mostrarFiltro = !this.mostrarFiltro;
    }

    /**
     * Envía un mensaje dentro de una conversación existente.
     * Determina automáticamente el receptor basándose en quién inició el hilo.
     */
    publicarMensaje(): void {
        if (this.nuevoMensaje.trim() && this.grupoSeleccionado && this.usuario) {
            
            const referencia = this.grupoSeleccionado[0];
            
            // Lógica para alternar el receptor: si yo soy el emisor del último, envío al receptor, y viceversa
            const receptorId = referencia.emisor!.id === this.usuario.id 
                ? referencia.receptor!.id 
                : referencia.emisor!.id;

            const nuevo: Mensaje = {
                id: 0,
                emisor_id: this.usuario.id,
                receptor_id: receptorId,
                servicio_id: referencia.servicio!.id,
                mensaje: this.nuevoMensaje,
                leido: false,
                created_at: new Date().toISOString()
            };

            this._mensajesService.createMensaje(nuevo).subscribe({
                next: (response: ApiResponse<Mensaje>) => {                
                    this.nuevoMensaje = '';
                    this.closeModal();
                    this.loadMensajes();
                    window.alert('Mensaje enviado correctamente.');
                },
                error: (err) => {
                    console.error('Error al publicar el mensaje:', err);
                }
            });
        }
    }
}
