export class Usuarios {

    public id: number;
    public nombre: string;
    public apellidos: string;
    public mail: string;
    public password: string;
    public direccion: string;

    constructor(id: number, nombre: string, apellidos: string, mail: string, password: string, direccion: string) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.mail = mail;
        this.password = password
        this.direccion = direccion;
    }
}

