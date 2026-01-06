import { Usuario } from "./usuarios";
import { Categorias } from "./categorias";
import { Provincias } from "./provincias";
import { Poblaciones } from "./poblaciones";


export interface Servicios {
    id: number;
    usuario_id: number;
    categoria_id: number;
    tipo: string;
    titulo: string;
    descripcion: string;
    ruta_img: string;
    provincia_id: number;
    ciudad_id: number;
    horas_estimadas: number;
    estado: string;
    created_at: string;
    usuario?: Usuario;
    categoria?: Categorias;
    provincia_relacion?: Provincias;
    ciudad_relacion?: Poblaciones;
}