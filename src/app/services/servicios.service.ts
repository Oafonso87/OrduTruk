import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Servicios } from "../models/servicios";



@Injectable({
  providedIn: 'root'
})

/**
 * Servicio principal para la gestión de Ofertas y Demandas.
 * Maneja la persistencia de los servicios en la plataforma.
 */
export class ServiciosService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  constructor(public _http: HttpClient) { }

  /**
   * Obtiene la colección completa de servicios registrados.
   */
  getServicios(): Observable<ApiResponse<Servicios[]>> {
    return this._http.get<ApiResponse<Servicios[]>>(`${this.url}/servicios`);
  }

  /**
   * Recupera la información detallada de un servicio (oferta o demanda) por su ID.
   * @param id Identificador único del servicio.
   */
  getServiciosById(id: number): Observable<ApiResponse<Servicios>> {
    return this._http.get<ApiResponse<Servicios>>(`${this.url}/servicio/${id}`);
  }

  /**
   * Registra un nuevo servicio en el sistema.
   * Se utiliza FormData para permitir el envío de imágenes adjuntas al anuncio.
   * @param formData Objeto con los datos del servicio y el archivo de imagen.
   */
  createServicio(formData: FormData): Observable<ApiResponse<Servicios>> {
    return this._http.post<ApiResponse<Servicios>>(`${this.url}/servicio`, formData);
  }

  /**
   * Actualiza un servicio existente.
   * Nota: Se envía como POST y se adjunta '_method: PUT' para que el backend 
   * pueda procesar correctamente el multipart/form-data (imágenes) en una edición.
   * @param id ID del servicio a modificar.
   * @param formData Datos actualizados del servicio.
   */
  updateServicio(id: number, formData: FormData): Observable<ApiResponse<Servicios>> {
    if (!formData.has('_method')) {
      formData.append('_method', 'PUT');
    }
    return this._http.post<ApiResponse<Servicios>>(`${this.url}/servicio/${id}`, formData);
  }

  /**
   * Elimina un servicio de la plataforma de forma permanente.
   */
  deleteServicio(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/servicio/${id}`);
  }

}