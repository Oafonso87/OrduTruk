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
    // Inicialización de catálogos y carga de la lista de servicios
    this.loadCategorias();
    this.loadProvincias();
    this.loadTodasPoblaciones();
    this.loadServicios();
  }

  constructor(private _router : Router, private _serviciosService : ServiciosService, 
              private _ubicacionesService : UbicacionesService, private _categoriasService : CategoriasService) {}

  // Arrays para el manejo de datos y filtros            
  public provincias : Provincias[] = [];
  public poblaciones : Poblaciones[] = [];
  public todasPoblaciones : Poblaciones[] = [];
  public categorias : Categorias[] = [];

  // Modelos para los selectores de filtrado
  public provincia: number | null = null;
  public poblacion: number | null = null;
  public categoria : number | null = null;
  public demandas : Servicios [] = [];

  // Configuración de la paginación local
  public numDemandas : number = 6;
  public pagActual : number = 1;

  // Listas derivadas: filtradas (según búsqueda) y paginadas (subconjunto visual)
  public demandasPaginadas: Servicios[] = [];
  public demandasFiltradas: Servicios[] = [];

  public tituloFilter : string = '';

  public mostrarFiltro: boolean = false;
  public loading : boolean = true;

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  /**
   * Recupera todos los servicios y filtra solo aquellos que son 
   * 'demanda' y están en estado 'activo'.
   */
  loadServicios() {
    this.loading = true;
    this._serviciosService.getServicios().subscribe({
      next: (response: ApiResponse<Servicios[]>) => {
        this.demandas = response.data.filter(s => s.tipo === 'demanda' && s.estado === 'activo');
        this.demandasFiltradas = [...this.demandas];
        this.updateDemandas();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las demandas:', err);
      }     
    });
  }

  // Métodos de carga de catálogos geográficos y de negocio
  loadCategorias() {
    this._categoriasService.getCategorias().subscribe({
      next: (response: ApiResponse<Categorias[]>) => {
        this.categorias = response.data;
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
      },
      error: (err) => {
        console.error('Error al cargar todas las poblaciones:', err);
      }
    });
  }
  
  // Actualiza la lista de poblaciones disponible según la provincia elegida y resetea filtros
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
    this.filterDemandas();
  }

  onPoblacionChange(valor: number | null) {
    this.poblacion = valor;
    this.pagActual = 1;
    this.filterDemandas();
  }  

  /**
   * Aplica un filtrado multidimensional (Categoría, Provincia, Población y Texto)
   * sobre la colección principal de demandas.
   */
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

  // Calcula el número total de páginas basándose en los resultados filtrados
  get totalPages(): number {
    return Math.ceil(this.demandasFiltradas.length / this.numDemandas);
  }

  /**
   * Extrae el segmento de datos (slice) que corresponde a la página actual 
   * para su visualización en el HTML.
   */
  updateDemandas() {
    const inicio = (this.pagActual - 1) * this.numDemandas;
    const fin = inicio + this.numDemandas;
    this.demandasPaginadas = this.demandasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(page: number) { 
    if (page < 1 || page > this.totalPages) return; this.pagActual = page; this.updateDemandas(); 
  }

}