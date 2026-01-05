import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-transaccion-detalle',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule, Button],
    templateUrl: './transaccion-detalle.html',
    styleUrl: './transaccion-detalle.scss',
})

export class TransaccionDetalle implements OnInit {
    id: string | null = null;

    constructor(private readonly route: ActivatedRoute) {}

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
    }

    aceptarOferta() {
        console.log('Oferta aceptada para id:', this.id);
    }

    contactar() {
        console.log('Contactar para id:', this.id);
    }
}
