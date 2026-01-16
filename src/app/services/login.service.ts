import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { LoginRequest } from "../models/loginrequest";
import { LoginResponse } from "../models/loginresponse";

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio de Autenticación.
 * Centraliza las operaciones de acceso, cierre de sesión y gestión de credenciales de seguridad.
 */
export class LoginService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  /**
   * Envía las credenciales al servidor para validar el acceso.
   * @param credenciales Objeto con email y password.
   * @returns Observable con el token de acceso y los datos básicos del usuario.
   */
  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.url}/login`, credenciales);  
  }

  /**
   * Solicita la invalidación del token en el servidor.
   * Requiere el envío explícito del token Bearer en la cabecera para identificar la sesión a cerrar.
   */
  logout(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    // Enviamos una petición POST vacía con las cabeceras de autorización necesarias
    return this._http.post<any>(`${this.url}/logout`, {}, { headers });
  }

  /**
   * Actualiza la contraseña del usuario identificado.
   * Utiliza FormData para el envío de la nueva credencial siguiendo el estándar del backend.
   * @param id Identificador del usuario.
   * @param password Nueva contraseña.
   */
  cambiarContraseña(id: number, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('password', password);  
    return this._http.post<any>(`${this.url}/users/${id}/change-password`, formData);
  }

}