import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router,  ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Button } from '../../components/button/button';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../models/apiresponse';
import { Usuario } from '../../models/usuarios';
import { Servicios } from '../../models/servicios';
import { Categorias } from '../../models/categorias';
import { Provincias } from '../../models/provincias';
import { Poblaciones } from '../../models/poblaciones';
import { ServiciosService } from '../../services/servicios.service';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
    selector: 'app-actualizar',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule],
    templateUrl: './actualizar.html',
    styleUrl: './actualizar.scss',
})

export class Actualizar implements OnInit {

    public id: number | null = null;

    ngOnInit(): void {
        const userAlmacenado = sessionStorage.getItem('user');
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = Number(idParam);
            this.loadServicio();
        }
        this.loadCategorias();
        this.loadProvincias();
        this.loadPoblaciones();
    }

    constructor(private _router: Router, private _serviciosService: ServiciosService,
        private _ubicacionesService: UbicacionesService, private _categoriasService: CategoriasService,
        private readonly route: ActivatedRoute) { }

    public titulo: string = '';
    public descripcion: string = '';
    public horas: number = 0;
    public provincias: Provincias[] = [];
    public poblaciones: Poblaciones[] = [];
    public todasPoblaciones: Poblaciones[] = [];
    public categorias: Categorias[] = [];
    public provincia: number | null = null;
    public poblacion: number | null = null;
    public categoria: number | null = null;
    public imagen : File | null = null;
    public servicio: Servicios | null = null;

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

    loadPoblaciones() {
        this._ubicacionesService.getPoblaciones().subscribe({
        next: (response: ApiResponse<Poblaciones[]>) => {
            this.todasPoblaciones = response.data;     
            
            if (this.provincia) {
            this.poblaciones = this.todasPoblaciones.filter(
                p => Number(p.provincia_id) === this.provincia
            );
            }
        },
        error: (err) => console.error('Error:', err)
        });
    }

    onProvinciaChange(valor: any) {
        this.provincia = Number(valor);
        this.poblacion = null;

        this.poblaciones = this.todasPoblaciones.filter(
        p => Number(p.provincia_id) === this.provincia
        );
    }

    loadServicio() {
        if (!this.id) return;
        this._serviciosService.getServiciosById(this.id).subscribe({
            next: (response: ApiResponse<Servicios>) => {
                this.servicio = response.data;
                
                this.titulo = this.servicio.titulo;
                this.descripcion = this.servicio.descripcion;
                this.horas = Number(this.servicio.horas_estimadas);
                this.categoria = Number(this.servicio.categoria_id);
                this.provincia = Number(this.servicio.provincia_id);
                this.poblacion = Number(this.servicio.ciudad_id);
                this.poblaciones = this.todasPoblaciones.filter(
                    p => Number(p.provincia_id) === this.provincia
                );
            },
            error: (err) => console.error('Error al cargar detalle:', err)
        });
    }

    actualizarServicio() {
        const actualización = new FormData();
        actualización.append('titulo', this.titulo);
        actualización.append('descripcion', this.descripcion);
        actualización.append('horas_estimadas', String(this.horas));
        actualización.append('categoria_id', String(this.categoria));
        actualización.append('provincia_id', String(this.provincia));
        actualización.append('ciudad_id', String(this.poblacion));
        if (this.imagen) {
            actualización.append('img', this.imagen);
        }

        this._serviciosService.updateServicio(this.servicio!.id, actualización).subscribe({
        next: (response: ApiResponse<Servicios>) => {
            alert('Servicio actualizado exitosamente.');
            this.resetForm();
            this._router.navigate(['/perfil']);
        },
        error: (err) => {
            console.error('Error al actualizar servicio:', err);
            alert('Hubo un error al actualizar el servicio.');
        }
        });
    }

    resetForm() {
        this.titulo = '';
        this.descripcion = '';
        this.horas = 0;
        this.provincia = null;
        this.poblacion = null;
        this.categoria = null;
        this.imagen = null;
    }

    incrementarHoras() {
        this.horas++;
    }

    decrementarHoras() {
        if (this.horas > 0) {
            this.horas--;
        }
    }

    onFileSelected(event: any) {
    const file: File = event.target.files[0];
        if (file) {
            this.imagen = file;
        }
    }

}
