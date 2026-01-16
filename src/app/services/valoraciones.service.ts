import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Valoraciones } from "../models/valoraciones";

@Injectable({
  providedIn: 'root'
})

/**
 * Servicio encargado de gestionar el sistema de reputación.
 * Permite almacenar y consultar las puntuaciones que los usuarios 
 * emiten tras completar una transacción de tiempo.
 */
export class ValoracionesService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }

  /**
   * Obtiene el listado global de todas las valoraciones registradas en el sistema.
   */
  getValoraciones(): Observable<ApiResponse<Valoraciones[]>> {
    return this._http.get<ApiResponse<Valoraciones[]>>(`${this.url}/valoraciones`);
  }

  /**
   * Recupera las valoraciones asociadas a un usuario específico.
   * Permite mostrar el historial de feedback y la puntuación media en el perfil del usuario.
   * @param id Identificador único del usuario valorado.
   */
  getValoracionesById(id: number): Observable<ApiResponse<Valoraciones[]>> {
    return this._http.get<ApiResponse<Valoraciones[]>>(`${this.url}/valoraciones/${id}`);
  }

  /**
   * Registra una nueva valoración tras finalizar satisfactoriamente un servicio.
   * Este método es invocado automáticamente al confirmar una transacción de tiempo.
   * @param valoracion Objeto que contiene el ID de transacción, puntuación y comentario.
   */
  createValoracion(valoracion: Valoraciones): Observable<ApiResponse<Valoraciones>> {
    return this._http.post<ApiResponse<Valoraciones>>(`${this.url}/valoracion`, valoracion, this.httpOptions);
  }

}