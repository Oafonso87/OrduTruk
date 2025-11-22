import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demandas',
  standalone: false,
  templateUrl: './demandas.component.html',
  styleUrl: './demandas.component.css',
  providers: []
})

export class DemandasComponent implements OnInit {
    
    ngOnInit(): void {      
    }

    constructor() {}

    public vistaActual: 'listado' | 'detalle' | 'aniadir' = 'listado';


}