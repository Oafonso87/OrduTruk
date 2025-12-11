import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';

@Component({
    selector: 'app-crear-ofertas',
    standalone: true,
    imports: [CommonModule, Header, Footer, Button],
    templateUrl: './crear-ofertas.html',
    styleUrl: './crear-ofertas.scss',
})
export class CrearOfertas implements OnInit {
    ngOnInit(): void {
    }

    constructor() { }

    public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'aniadir';
    public mostrarFiltro: boolean = false;

    // Array para repetir ofertas 6 veces
    public ofertas = Array(6).fill(0);

    toggleFiltro(): void {
        this.mostrarFiltro = !this.mostrarFiltro;
    }
}
