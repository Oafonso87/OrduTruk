import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';

@Component({
    selector: 'app-mensajes',
    standalone: true,
    imports: [CommonModule, Header, Footer, Button],
    templateUrl: './mensajes.html',
    styleUrl: './mensajes.scss',
})
export class Mensajes implements OnInit {
    ngOnInit(): void {
    }

    constructor() { }

    public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';
    public mostrarFiltro: boolean = false;

    // Array para repetir mensajes 6 veces
    public mensajes = Array(6).fill(0);

    // Array para repetir ofertas 3 veces
    public ofertas = Array(3).fill(0);

    toggleFiltro(): void {
        this.mostrarFiltro = !this.mostrarFiltro;
    }
}
