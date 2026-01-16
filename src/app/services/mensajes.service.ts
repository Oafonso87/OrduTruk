import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Mensaje } from "../models/mensaje";




@Injectable({
  providedIn: 'root'
})

/**
 * Servicio encargado de la mensajería interna entre usuarios.
 * Facilita la comunicación en el contexto de ofertas y demandas activas.
 */
export class MensajesService {

  // Endpoints diferenciados para operaciones de listado y operaciones unitarias
  private url: string = 'https://proyecto-daw-backend.onrender.com/api/mensajes';
  private url2: string = 'https://proyecto-daw-backend.onrender.com/api/mensaje';


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }

  /**
   * Obtiene el historial completo de mensajes del sistema.
   */
  getMensajes(): Observable<ApiResponse<Mensaje[]>> {
    return this._http.get<ApiResponse<Mensaje[]>>(this.url);
  }

  /**
   * Recupera todos los mensajes vinculados a un id específico.
   * @param id Identificador del usuario.
   */
  getMensajesById(id: number): Observable<ApiResponse<Mensaje[]>> {
    return this._http.get<ApiResponse<Mensaje[]>>(`${this.url}/${id}`);
  }

  /**
   * Registra un nuevo mensaje en la base de datos.
   * @param mens Objeto con la información del emisor, receptor y contenido.
   */
  createMensaje(mens: Mensaje): Observable<ApiResponse<Mensaje>> {
    return this._http.post<ApiResponse<Mensaje>>(this.url2, mens, this.httpOptions);
  }

  /**
   * Actualiza el estado de un mensaje existente (ej: marcar como leído).
   * @param mens Objeto mensaje con los datos actualizados.
   */
  updateMensaje(mens: Mensaje): Observable<ApiResponse<Mensaje>> {
    return this._http.put<ApiResponse<Mensaje>>(`${this.url2}/${mens.id}`, mens, this.httpOptions);
  }

  /**
   * Elimina un mensaje del historial de forma permanente.
   * @param id Identificador único del mensaje.
   */
  deleteMensaje(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/${id}`);
  }

}