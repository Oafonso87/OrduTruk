import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Usuario } from "../models/usuarios";
import { LoginResponse } from "../models/loginresponse";


@Injectable({
  providedIn: 'root'
})

/**
 * Servicio de gestión de usuarios y estado de cuenta.
 * Además de las operaciones CRUD, gestiona la sincronización reactiva del saldo 
 * de horas en toda la aplicación mediante Observables.
 */
export class UsuariosService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';
  
  // Fuente de datos para notificar cambios en el saldo de horas
  private actualizarSaldoSource = new Subject<void>();
  // Observable al que se suscriben componentes (como el Header) para reaccionar al cambio
  actualizarSaldo$ = this.actualizarSaldoSource.asObservable();

  constructor(public _http: HttpClient) { }

  /**
   * Dispara un evento para avisar a otros componentes que el saldo ha cambiado
   * y deben actualizar su vista.
   */
  notificarCambioSaldo() {
    this.actualizarSaldoSource.next();
  }

  /**
   * Recupera el listado completo de usuarios registrados.
   */
  getUsuarios(): Observable<ApiResponse<Usuario[]>> {
    return this._http.get<ApiResponse<Usuario[]>>(`${this.url}/users`);
  }

  /**
   * Obtiene la información detallada de un perfil de usuario.
   */
  getUsuarioById(id: number): Observable<ApiResponse<Usuario>> {
    return this._http.get<ApiResponse<Usuario>>(`${this.url}/users/${id}`);
  }

  /**
   * Gestiona el registro de nuevos usuarios en la plataforma.
   * Al ser un registro inicial que incluye imagen, se utiliza FormData.
   */
  createUsuario(formData: FormData): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.url}/register`, formData);
  }  

  /**
   * Actualiza los datos del perfil (dirección, ciudad, imagen, etc.).
   * Se utiliza el método POST con el campo '_method: PUT' para permitir la 
   * carga de archivos (imágenes) en la petición de actualización.
   */
  updateUsuario(id: number, formData: FormData): Observable<ApiResponse<Usuario>> {
    if (!formData.has('_method')) {
    formData.append('_method', 'PUT');
    }    
    return this._http.post<ApiResponse<Usuario>>(`${this.url}/users/${id}`, formData);
  }

  /**
   * Elimina una cuenta de usuario de la plataforma.
   */
  deleteUsuario(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/users/${id}`);
  }

}