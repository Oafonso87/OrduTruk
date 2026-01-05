import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { FormsModule } from '@angular/forms';
import { TransaccionesService } from '../../services/transacciones.service';
import { Transacciones } from '../../models/transacciones';
import { ApiResponse } from '../../models/apiresponse';

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

    constructor( private readonly route: ActivatedRoute, private _transaccionesService: TransaccionesService) {}

    ngOnInit() {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = Number(idParam);
            this.loadDetalle();
        }
    }

    loadDetalle() {
        if (!this.id) return;
        this._transaccionesService.getTransacciones().subscribe({
            next: (response: ApiResponse<Transacciones[]>) => {
                // Buscamos la transacción específica
                const detalle = response.data.find(t => t.id === this.id);
                if (detalle) {
                    this.transaccion = detalle;
                    console.log('Detalle de transacción:', this.transaccion);
                }
            },
            error: (err) => console.error('Error al cargar detalle:', err)
        });
    }

    aceptarOferta() {
        console.log('Oferta aceptada para id:', this.id);
    }

    rechazar() {
        console.log('Rechazar transacción:', this.id);
    }
}