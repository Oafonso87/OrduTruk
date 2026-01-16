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
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterLink, FormsModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.scss'
})

export class OfertasComponent implements OnInit {

  ngOnInit(): void {
    // Limpieza de datos temporales de navegación previa
    sessionStorage.removeItem('ofertaSeleccionada');
    // Carga inicial de datos maestros y listado principal
    this.loadCategorias();
    this.loadProvincias();
    this.loadTodasPoblaciones();
    this.loadServicios();
  }

  constructor(private _router : Router, private _serviciosService : ServiciosService, 
              private _ubicacionesService : UbicacionesService, private _categoriasService : CategoriasService) {}

  // Listados para selectores y almacenamiento de datos            
  public provincias : Provincias[] = [];
  public poblaciones : Poblaciones[] = [];
  public todasPoblaciones : Poblaciones[] = [];
  public categorias : Categorias[] = [];
  // Modelos para el control de filtros activos
  public provincia: number | null = null;
  public poblacion: number | null = null;
  public categoria : number | null = null;
  public ofertas : Servicios [] = [];
  // Configuración de paginación en el front-end
  public numOfertas : number = 6;
  public pagActual : number = 1;
  // Subconjuntos de datos para visualización
  public ofertasPaginadas: Servicios[] = [];
  public ofertasFiltradas: Servicios[] = [];

  public tituloFilter : string = '';

  public mostrarFiltro: boolean = false;
  public loading: boolean = true;

  toggleFiltro(): void {
    this.mostrarFiltro = !this.mostrarFiltro;
  }

  /**
   * Obtiene todos los servicios y filtra los de tipo 'oferta' activos.
   * Centraliza la carga inicial y el estado de carga (loading).
   */
  loadServicios() {
    this.loading = true;
    this._serviciosService.getServicios().subscribe({
      next: (response: ApiResponse<Servicios[]>) => {
        this.ofertas = response.data.filter(s => s.tipo === 'oferta' && s.estado === 'activo');
        this.ofertasFiltradas = [...this.ofertas];
        this.updateOfertas();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las ofertas:', err);
      }     
    });
  }

  // Métodos de carga de catálogos mediante servicios inyectados
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
  
  /**
   * Gestiona el cambio de provincia, actualizando dinámicamente el combo de poblaciones
   * y disparando el filtrado de la lista principal.
   */
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
    this.filterOfertas();
  }

  // Handlers para cambios en filtros de categoría y población específica
  onCategoriaChange(valor: number | null) {
    this.categoria = valor;
    this.pagActual = 1;
    this.filterOfertas();
  }

  onPoblacionChange(valor: number | null) {
    this.poblacion = valor;
    this.pagActual = 1;
    this.filterOfertas();
  }  

  /**
   * Aplica lógica de filtrado acumulativo sobre la colección de ofertas.
   * Filtra por categoría, provincia, población y búsqueda textual por título.
   */
  filterOfertas() {
    this.ofertasFiltradas = this.ofertas;

    if (this.categoria !== null) {
      const cat = Number(this.categoria);
      this.ofertasFiltradas = this.ofertasFiltradas.filter(o => o.categoria!.id === cat);
    }

    if (this.provincia !== null) {
      const prov = Number(this.provincia);
      this.ofertasFiltradas = this.ofertasFiltradas.filter(o => o.ciudad_relacion!.provincia_id === prov);
    }

    if (this.poblacion !== null) {
      const pob = Number(this.poblacion);
      this.ofertasFiltradas = this.ofertasFiltradas.filter(o => o.ciudad_relacion!.id === pob);
    }

    if (this.tituloFilter && this.tituloFilter.trim() !== '') {
      const texto = this.tituloFilter.toLowerCase();
      this.ofertasFiltradas = this.ofertasFiltradas.filter(o =>
        o.titulo.toLowerCase().includes(texto)
      );
    }

    this.pagActual = 1;
    this.updateOfertas();
  }

  // Getter para calcular el total de páginas necesarias según resultados filtrados
  get totalPages(): number {
    return Math.ceil(this.ofertasFiltradas.length / this.numOfertas);
  }

  /**
   * Calcula el rango de elementos a mostrar en la vista actual (paginación por slice).
   */
  updateOfertas() {
    const inicio = (this.pagActual - 1) * this.numOfertas;
    const fin = inicio + this.numOfertas;
    this.ofertasPaginadas = this.ofertasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(page: number) { 
    if (page < 1 || page > this.totalPages) return; this.pagActual = page; this.updateOfertas(); 
  }

  // Persiste la oferta en sesión para agilizar la carga en la vista de detalle
  guardarOferta(oferta: any) {
    sessionStorage.setItem('ofertaSeleccionada', JSON.stringify(oferta));
  }

}