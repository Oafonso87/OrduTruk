import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Categorias } from "../models/categorias";


@Injectable({
  providedIn: 'root'
})

/**
 * Servicio encargado de la gestión de categorías de servicios.
 * Proporciona acceso a los datos necesarios para clasificar ofertas y demandas.
 */
export class CategoriasService {

  // Endpoint base de la API alojada en Render
  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  // Configuración de cabeceras estándar para peticiones JSON
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }

  /**
   * Obtiene el listado completo de categorías disponibles en el sistema.
   * @returns Observable con la respuesta de la API que contiene el array de Categorias.
   */
  getCategorias(): Observable<ApiResponse<Categorias[]>> {
    return this._http.get<ApiResponse<Categorias[]>>(`${this.url}/getCategorias`);
  }

  /**
   * Recupera la información detallada de una categoría específica mediante su identificador.
   * @param id Identificador único de la categoría.
   */
  getCategoriasById(id: number): Observable<ApiResponse<Categorias[]>> {
    return this._http.get<ApiResponse<Categorias[]>>(`${this.url}/getCategorias/${id}`);
  }

}