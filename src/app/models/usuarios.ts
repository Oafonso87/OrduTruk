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
    img_perfil: string;
    rol_id: number;
    password?: string;
    direccion?: string;    
}