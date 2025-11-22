export class Usuarios {

    public idIncidencia: number;
    public idTrabajador: number;
    public nombreTrabajador: string;
    public idInstalacion: number;
    public nombreInstalacion: string;
    public hora: string;
    public descripcion: string;

    constructor(idIncidencia: number, idTrabajador: number, nombreTrabajador: string, idInstalacion: number, nombreInstalacion: string, hora: string, descripcion: string) {
        this.idIncidencia = idIncidencia;
        this.idTrabajador = idTrabajador;
        this.nombreTrabajador = nombreTrabajador;
        this.idInstalacion = idInstalacion;
        this.nombreInstalacion = nombreInstalacion;
        this.hora = hora;
        this.descripcion = descripcion;
    }
}

