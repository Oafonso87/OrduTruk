import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Provincias } from "../models/provincias";
import { Poblaciones } from "../models/poblaciones";


@Injectable({
  providedIn: 'root'
})

/**
 * Servicio de Ubicaciones Geográficas.
 * Gestiona la recuperación de provincias y poblaciones para la gestión 
 * de direcciones y el filtrado por localización en toda la plataforma.
 */
export class UbicacionesService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }

  /**
   * Recupera el catálogo completo de provincias disponibles.
   */
  getProvincias(): Observable<ApiResponse<Provincias[]>> {
    return this._http.get<ApiResponse<Provincias[]>>(`${this.url}/getProvincias`);
  }

  /**
   * Obtiene los datos de una provincia específica.
   * @param id Identificador de la provincia.
   */
  getProvinciasById(id: number): Observable<ApiResponse<Provincias[]>> {
    return this._http.get<ApiResponse<Provincias[]>>(`${this.url}/getProvincias/${id}`);
  }

  /**
   * Recupera el listado completo de poblaciones. 
   * Nota: Suele filtrarse en el cliente comparando con 'provincia_id'.
   */
  getPoblaciones(): Observable<ApiResponse<Poblaciones[]>> {
    return this._http.get<ApiResponse<Poblaciones[]>>(`${this.url}/getPoblaciones`);
  }

  /**
   * Obtiene los datos de una población específica.
   * @param id Identificador de la población.
   */
  getPoblacionesById(id: number): Observable<ApiResponse<Poblaciones[]>> {
    return this._http.get<ApiResponse<Poblaciones[]>>(`${this.url}/getPoblaciones/${id}`);
  }  

}