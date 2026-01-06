export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    provincia_id: number;
    ciudad_id: number;
    descripcion: string;
    horas_saldo: number;
    valoracion: number;
    ruta_img: string;
    rol_id: number;
    password?: string;
    direccion?: string;    
}