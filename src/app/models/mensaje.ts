import { Usuario } from "./usuarios"
import { Servicios } from "./servicios"

export interface Mensaje {
    id: number,
    emisor_id: number,
    receptor_id: number,
    servicio_id: number,
    mensaje: string,
    leido: boolean,
    created_at: string,
    emisor?: Usuario,
    receptor?: Usuario,
    servicio?: Servicios
}