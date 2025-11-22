import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ofertas',
  standalone: false,
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.css',
  providers: []
})

export class OfertasComponent implements OnInit {
    
    ngOnInit(): void {      
    }

    constructor() {}

    public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';


}