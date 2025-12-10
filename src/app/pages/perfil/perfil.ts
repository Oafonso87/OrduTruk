import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, Header, Footer, Button],
    templateUrl: './perfil.html',
    styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
    ngOnInit(): void {
    }

    constructor() { }

    public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'detalle';
    public mostrarFiltro: boolean = false;

    // Array para repetir ofertas 6 veces
    public ofertas = Array(3).fill(0);

    toggleFiltro(): void {
        this.mostrarFiltro = !this.mostrarFiltro;
    }
}
