import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { ApiResponse } from '../../models/apiresponse';
import { Mensaje } from '../../models/mensaje';
import { MensajesService } from '../../services/mensajes.service';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuarios';

@Component({
    selector: 'app-mensajes',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule],
    templateUrl: './mensajes.html',
    styleUrl: './mensajes.scss',
})

export class Mensajes implements OnInit {
    
    public usuario : Usuario |null = null;
    
    ngOnInit(): void {
        const userAlmacenado = sessionStorage.getItem('user');
        if (userAlmacenado) {
            this.usuario = JSON.parse(userAlmacenado);
        }
        console.log(userAlmacenado);
        this.loadMensajes();
    }

    constructor(private _mensajesService : MensajesService) { }

    public mensajes : Mensaje[] = [];

    loadMensajes() {
        this._mensajesService.getMensajesById(this.usuario!.id).subscribe({
            next: (response: ApiResponse<Mensaje[]>) => {
            this.mensajes = response.data;
            console.log('Mensajes cargadas:', this.mensajes);
            },
            error: (err) => {
            console.error('Error al cargar los mensajes:', err);
            }     
        });
    }

}
