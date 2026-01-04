import { Usuario } from "./usuarios";
import { Servicios } from "./servicios";

export interface Transacciones {
    id: number;
    servicio_id: number;
    usuario_solicitante_id: number;
    usuario_ofertante_id: number;
    horas:number;
    estado: string;
    fecha_confirmacion: string;
    created_at: string;
    servicio?: Servicios;
    usuario_solicitante?: Usuario;
    usuario_ofertante?: Usuario;
}