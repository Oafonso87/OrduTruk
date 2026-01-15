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

    public mensajes : Mensaje[] [] = [];
    public activeTab: 'ofertas' | 'demandas' = 'ofertas';
    public activeMessageIndex: number | null = null;
    public isModalOpen: boolean = false;
    public nuevoMensaje: string = '';
    public grupoSeleccionado: Mensaje[] | null = null;

    
    loadMensajes() {
        this._mensajesService.getMensajesById(this.usuario!.id).subscribe({
            next: (response: ApiResponse<Mensaje[]>) => {
                const todosLosMensajes = response.data;

                const grupos = todosLosMensajes.reduce((acc: { [key: string]: Mensaje[] }, mensaje) => {
                    const servicioId = mensaje.servicio!.id;
                    
                    const interlocutorId = mensaje.emisor!.id === this.usuario!.id 
                        ? mensaje.receptor!.id 
                        : mensaje.emisor!.id;

                    
                    const grupoKey = `s${servicioId}_u${interlocutorId}`;

                    if (!acc[grupoKey]) {
                        acc[grupoKey] = [];
                    }
                    acc[grupoKey].push(mensaje);
                    return acc;
                }, {});

                this.mensajes = Object.values(grupos);
            },
            error: (err) => {
                console.error('Error al cargar los mensajes:', err);
            }     
        });
    }
    

    setActiveTab(tab: 'ofertas' | 'demandas'): void {
        this.activeTab = tab;
        this.activeMessageIndex = null;
    }

    toggleMessage(index: number): void {
        this.activeMessageIndex = this.activeMessageIndex === index ? null : index;
    }    

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

    publicarMensaje(): void {
        if (this.nuevoMensaje.trim() && this.grupoSeleccionado && this.usuario) {
            
            const referencia = this.grupoSeleccionado[0];
            
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
