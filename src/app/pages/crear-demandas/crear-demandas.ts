import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { UsuariosService } from '../../services/usuarios.service';

@Component({
    selector: 'app-crear-ofertas',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule],
    templateUrl: './crear-demandas.html',
    styleUrl: './crear-demandas.scss',
})

export class CrearDemandas implements OnInit {

    public usuario: Usuario | null = null;

    ngOnInit(): void {
        const userAlmacenado = sessionStorage.getItem('user');
        if (userAlmacenado) {
            this.usuario = JSON.parse(userAlmacenado);
        }
        console.log(userAlmacenado);
        this.loadCategorias();
        this.loadProvincias();
        this.loadPoblaciones();
    }

    constructor(private _router: Router, private _serviciosService: ServiciosService,
        private _ubicacionesService: UbicacionesService, private _categoriasService: CategoriasService,
        private _usuariosService: UsuariosService) { }

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

    loadPoblaciones() {
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
    }

    publicarDemanda() {
        if (!this.usuario) return;

        const saldoActual = Number(this.usuario.horas_saldo);
        const horasDemanda = Number(this.horas);
        const nuevoSaldo = saldoActual - horasDemanda;

        if (nuevoSaldo < 0) {
            window.alert(`No tienes saldo suficiente para publicar esta demanda. \nSaldo: ${saldoActual}h | Requerido: ${horasDemanda}h`);
            return;
        }

        const nuevaDemanda = new FormData();
        nuevaDemanda.append('id', '0');
        nuevaDemanda.append('usuario_id', String(this.usuario?.id));
        nuevaDemanda.append('categoria_id', String(this.categoria));
        nuevaDemanda.append('tipo', 'demanda');
        nuevaDemanda.append('titulo', this.titulo);
        nuevaDemanda.append('descripcion', this.descripcion);
        if (this.imagen) {
            nuevaDemanda.append('img', this.imagen);
        }
        nuevaDemanda.append('provincia_id', String(this.provincia));
        nuevaDemanda.append('ciudad_id', String(this.poblacion));
        nuevaDemanda.append('horas_estimadas', String(this.horas));
        nuevaDemanda.append('estado', 'activo');
        console.log(nuevaDemanda);
        this._serviciosService.createServicio(nuevaDemanda).subscribe({
            next: (response: ApiResponse<Servicios>) => {
                console.log('Demanda creada con éxito. Procediendo a bloquear horas...');            
                this.descontarHorasUsuario(nuevoSaldo);
            },
            error: (error) => {
                console.error("Error al crear la demanda:", error);
            }
        });
    }

    private descontarHorasUsuario(nuevoSaldo: number) {
        const userData = new FormData();
        userData.append('horas_saldo', String(nuevoSaldo));

        this._usuariosService.updateUsuario(this.usuario!.id, userData).subscribe({
            next: (res) => {
                console.log('Saldo del demandante actualizado');                
                this.usuario!.horas_saldo = nuevoSaldo;
                sessionStorage.setItem('user', JSON.stringify(this.usuario));
                this._usuariosService.notificarCambioSaldo();
                setTimeout(() => {
                    this.resetForm();
                    this._router.navigate(['/demandas']);
                }, 1000);
            },
            error: (err) => {
                console.error('Error al descontar saldo:', err);
                this._router.navigate(['/demandas']);
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
