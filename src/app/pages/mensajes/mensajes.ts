import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ModalComponent } from '../../components/modal/modal';
import { Button } from '../../components/button/button';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-mensajes',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule, HttpClientModule, ModalComponent],
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

    public activeTab: 'ofertas' | 'demandas' = 'ofertas';
    public activeMessageIndex: number | null = null;

    setActiveTab(tab: 'ofertas' | 'demandas'): void {
        this.activeTab = tab;
        this.activeMessageIndex = null;
    }

    toggleMessage(index: number): void {
        this.activeMessageIndex = this.activeMessageIndex === index ? null : index;
    }

    public isModalOpen: boolean = false;

    openModal(): void {
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
    }
}
