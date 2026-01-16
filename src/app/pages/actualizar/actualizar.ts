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
import { UsuariosService } from '../../services/usuarios.service';

@Component({
    selector: 'app-actualizar',
    standalone: true,
    imports: [CommonModule, Header, Footer, FormsModule],
    templateUrl: './actualizar.html',
    styleUrl: './actualizar.scss',
})

export class Actualizar implements OnInit {

    public id: number | null = null;
    public usuario: Usuario | null = null;


    ngOnInit(): void {
        const userAlmacenado = sessionStorage.getItem('user');
        if (userAlmacenado) {
            this.usuario = JSON.parse(userAlmacenado);
        }
        // Obtenemos el ID de la URL para cargar los datos del servicio específico
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.id = Number(idParam);
            this.loadServicio();
        }
        // Carga inicial de catálogos para los selectores del formulario
        this.loadCategorias();
        this.loadProvincias();
        this.loadPoblaciones();
    }

    constructor(private _router: Router, private _serviciosService: ServiciosService,
        private _ubicacionesService: UbicacionesService, private _categoriasService: CategoriasService,
        private readonly route: ActivatedRoute, private _usuariosService: UsuariosService) { }

    // Propiedades vinculadas al formulario    
    public titulo: string = '';
    public descripcion: string = '';
    public horas: number = 0;
    public horas_antiguas : number = 0;
    public tipo: string = '';
    public provincias: Provincias[] = [];
    public poblaciones: Poblaciones[] = [];
    public todasPoblaciones: Poblaciones[] = [];
    public categorias: Categorias[] = [];
    public provincia: number | null = null;
    public poblacion: number | null = null;
    public categoria: number | null = null;
    public imagen : File | null = null;
    public servicio: Servicios | null = null;

    // Métodos de carga de datos clave (Categorías, Provincias, Poblaciones)
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
            // Si ya tenemos provincia (al editar), filtramos las poblaciones correspondientes
            if (this.provincia) {
            this.poblaciones = this.todasPoblaciones.filter(
                p => Number(p.provincia_id) === this.provincia
            );
            }
        },
        error: (err) => console.error('Error:', err)
        });
    }

    // Actualiza el listado de poblaciones cuando el usuario selecciona otra provincia
    onProvinciaChange(valor: any) {
        this.provincia = Number(valor);
        this.poblacion = null;
        this.poblaciones = this.todasPoblaciones.filter(
        p => Number(p.provincia_id) === this.provincia
        );
    }

    // Recupera los datos del servicio y los mapea a las variables del formulario
    loadServicio() {
        if (!this.id) return;
        this._serviciosService.getServiciosById(this.id).subscribe({
            next: (response: ApiResponse<Servicios>) => {
                this.servicio = response.data;
                
                this.titulo = this.servicio.titulo;
                this.descripcion = this.servicio.descripcion;
                this.horas = Number(this.servicio.horas_estimadas);
                this.horas_antiguas = Number(this.servicio.horas_estimadas);
                this.tipo = this.servicio.tipo;
                this.categoria = Number(this.servicio.categoria_id);
                this.provincia = Number(this.servicio.provincia_id);
                this.poblacion = Number(this.servicio.ciudad_id);
                // Aseguramos que el combo de poblaciones se llene según la provincia del servicio
                this.poblaciones = this.todasPoblaciones.filter(
                    p => Number(p.provincia_id) === this.provincia
                );
            },
            error: (err) => console.error('Error al cargar detalle:', err)
        });
    }

    /**
     * Procesa la actualización del servicio diferenciando entre ofertas y demandas.
     * En demandas, gestiona el flujo de reajuste de horas retenidas.
     */
    actualizarServicio() {
        const actualizacion = new FormData();
        actualizacion.append('titulo', this.titulo);
        actualizacion.append('descripcion', this.descripcion);
        actualizacion.append('horas_estimadas', String(this.horas));
        actualizacion.append('categoria_id', String(this.categoria));
        actualizacion.append('provincia_id', String(this.provincia));
        actualizacion.append('ciudad_id', String(this.poblacion));
        if (this.imagen) {
            actualizacion.append('img', this.imagen);
        }

        // Flujo para Ofertas: Actualización directa de información
        if (this.tipo === 'oferta') {
            this._serviciosService.updateServicio(this.servicio!.id, actualizacion).subscribe({
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
        // Flujo para Demandas: Gestión de saldo de horas del usuario    
        } else if (this.tipo === 'demanda') {
            // Calculamos la diferencia entre lo que había retenido y lo nuevo
            const diferencia = this.horas_antiguas - this.horas;
            const nuevoSaldo = Number(this.usuario!.horas_saldo) + diferencia;
            // Bloqueo si el usuario intenta subir horas sin tener saldo suficiente
            if (nuevoSaldo < 0) {
                alert('No tienes saldo suficiente para aumentar las horas de esta demanda.');
                return;
            }
            // Encadenamos: si el servicio se actualiza bien, actualizamos el saldo del usuario
            this._serviciosService.updateServicio(this.servicio!.id, actualizacion).subscribe({
                next: () => {
                    this.actualizarHorasUsuario(nuevoSaldo);
                },
                error: (err) => console.error('Error al actualizar servicio:', err)
            });        
        }
    }

    // Actualiza el saldo del usuario en el servidor y sincroniza la sesión local
    private actualizarHorasUsuario(nuevoSaldo: number) {
        const userData = new FormData();
        userData.append('horas_saldo', String(nuevoSaldo));

        this._usuariosService.updateUsuario(this.usuario!.id, userData).subscribe({
            next: (res) => {
                this.usuario!.horas_saldo = nuevoSaldo;
                sessionStorage.setItem('user', JSON.stringify(this.usuario));
                this._usuariosService.notificarCambioSaldo();
                window.alert('Servicio actualizado exitosamente.');
                this.resetForm();
                this._router.navigate(['/perfil']);
            },
            error: (err) => {
                console.error('Error al descontar saldo:', err);
                this._router.navigate(['/perfil']);
            }
        });
    }

    // Limpia el formulario después de una actualización
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
