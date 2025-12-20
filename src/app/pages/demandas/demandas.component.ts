import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../models/apiresponse';
import { Servicios } from '../../models/servicios';
import { Categorias } from '../../models/categorias';
import { Provincias } from '../../models/provincias';
import { Poblaciones } from '../../models/poblaciones';
import { ServiciosService } from '../../services/servicios.service';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-demandas',
  standalone: true,
  imports: [CommonModule, Header, Footer, FormsModule, RouterLink],
  templateUrl: './demandas.component.html',
  styleUrl: './demandas.component.scss'
})

export class DemandasComponent implements OnInit {

  ngOnInit(): void {
    sessionStorage.removeItem('demandaSeleccionada');
    this.loadCategorias();
    this.loadProvincias();
    this.loadTodasPoblaciones();
    this.loadServicios();
  }

  constructor(private _router : Router, private _serviciosService : ServiciosService, 
              private _ubicacionesService : UbicacionesService, private _categoriasService : CategoriasService) {}

  public provincias : Provincias[] = [];
  public poblaciones : Poblaciones[] = [];
  public todasPoblaciones : Poblaciones[] = [];
  public categorias : Categorias[] = [];
  public provincia: number | null = null;
  public poblacion: number | null = null;
  public categoria : number | null = null;
  public demandas : Servicios [] = [];

  public numDemandas : number = 6;
  public pagActual : number = 1;

  public demandasPaginadas: Servicios[] = [];
  public demandasFiltradas: Servicios[] = [];

  public tituloFilter : string = '';

  public mostrarFiltro: boolean = false;

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  loadServicios() {
    this._serviciosService.getServicios().subscribe({
      next: (response: ApiResponse<Servicios[]>) => {
        this.demandas = response.data.filter(s => s.tipo === 'demanda');
        this.demandasFiltradas = [...this.demandas];
        this.updateDemandas();
        console.log('Demandas cargadas:', this.demandas);
      },
      error: (err) => {
        console.error('Error al cargar las demandas:', err);
      }     
    });
  }

  loadCategorias() {
    this._categoriasService.getCategorias().subscribe({
      next: (response: ApiResponse<Categorias[]>) => {
        this.categorias = response.data;
        console.log('Categorias cargadas:', this.categorias);
      },
      error: (err) => {
        console.error('Error al cargar las categorias:', err);
      }     
    });    
  }

  loadProvincias() {
    this._ubicacionesService.getProvincias().subscribe({
      next: (response: ApiResponse<Provincias[]>) => {
        this.provincias = response.data;
        console.log('Provincias cargadas:', this.provincias);
      },
      error: (err) => {
        console.error('Error al cargar las provincias:', err);
      } 
    });
  }

  loadTodasPoblaciones() {
    this._ubicacionesService.getPoblaciones().subscribe({
      next: (response: ApiResponse<Poblaciones[]>) => {
        this.todasPoblaciones = response.data;
        console.log('Todas las poblaciones cargadas:', this.todasPoblaciones);
      },
      error: (err) => {
        console.error('Error al cargar todas las poblaciones:', err);
      }
    });
  }
  
  onProvinciaChange(valor: number | null) {
    const provinciaId = valor !== null ? Number(valor) : null;

    this.provincia = provinciaId;
    this.poblacion = null;

    if (provinciaId !== null) {
      this.poblaciones = this.todasPoblaciones.filter(
        p => Number(p.provincia_id) === provinciaId
      );
    } else {
      this.poblaciones = [];
    }
    this.pagActual = 1;
    this.filterDemandas();
  }


  onCategoriaChange(valor: number | null) {
    this.categoria = valor;
    this.pagActual = 1;
    console.log('Categoria seleccionada:', valor);
    this.filterDemandas();
  }

  onPoblacionChange(valor: number | null) {
    this.poblacion = valor;
    this.pagActual = 1;
    this.filterDemandas();
  }  

  filterDemandas() {
    this.demandasFiltradas = this.demandas;

    if (this.categoria !== null) {
      const cat = Number(this.categoria);
      this.demandasFiltradas = this.demandasFiltradas.filter(o => o.categoria!.id === cat);
    }

    if (this.provincia !== null) {
      const prov = Number(this.provincia);
      this.demandasFiltradas = this.demandasFiltradas.filter(o => o.ciudad_relacion!.provincia_id === prov);
    }

    if (this.poblacion !== null) {
      const pob = Number(this.poblacion);
      this.demandasFiltradas = this.demandasFiltradas.filter(o => o.ciudad_relacion!.id === pob);
    }

    if (this.tituloFilter && this.tituloFilter.trim() !== '') {
      const texto = this.tituloFilter.toLowerCase();
      this.demandasFiltradas = this.demandasFiltradas.filter(o =>
        o.titulo.toLowerCase().includes(texto)
      );
    }

    this.pagActual = 1;
    this.updateDemandas();
  }

  get totalPages(): number {
    return Math.ceil(this.demandasFiltradas.length / this.numDemandas);
  }

  updateDemandas() {
    const inicio = (this.pagActual - 1) * this.numDemandas;
    const fin = inicio + this.numDemandas;
    this.demandasPaginadas = this.demandasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(page: number) { 
    if (page < 1 || page > this.totalPages) return; this.pagActual = page; this.updateDemandas(); 
  }

  guardarDemanda(demanda: any) {
    sessionStorage.setItem('demandaSeleccionada', JSON.stringify(demanda));
  }
}