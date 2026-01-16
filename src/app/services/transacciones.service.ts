import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Transacciones } from "../models/transacciones";


@Injectable({
  providedIn: 'root'
})

/**
 * Servicio encargado de gestionar el historial de transacciones.
 * Registra y actualiza el estado de las transacciones entre usuarios, 
 * actuando como el registro oficial de la transferencia de tiempo.
 */
export class TransaccionesService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }

  /**
   * Recupera el listado completo de transacciones.
   */
  getTransacciones(): Observable<ApiResponse<Transacciones[]>> {
    return this._http.get<ApiResponse<Transacciones[]>>(`${this.url}/transacciones`);
  }

  /**
   * Obtiene una transacción específica mediante su identificador único.
   * @param id Identificador de la transacción.
   */
  getTransaccionesById(id: number): Observable<ApiResponse<Transacciones>> {
    return this._http.get<ApiResponse<Transacciones>>(`${this.url}/transacciones/${id}`);
  }

  /**
   * Crea un nuevo registro de transacción al aceptar una oferta o demanda.
   * @param transaccion Datos de la transacción (usuarios, servicio y horas).
   */
  createTransaccion(transaccion: any): Observable<ApiResponse<Transacciones>> {
    return this._http.post<ApiResponse<Transacciones>>(`${this.url}/transaccion`, transaccion, this.httpOptions);
  }

  /**
   * Actualiza el estado de una transacción existente (confirmada o cancelada).
   * Fundamental para disparar la transferencia de saldo en el backend.
   * @param transaccion Objeto transacción con los datos actualizados.
   */
  updateTransaccion(transaccion:any): Observable<ApiResponse<Transacciones>> {
    return this._http.put<ApiResponse<Transacciones>>(`${this.url}/transaccion/${transaccion.id}`, transaccion, this.httpOptions);
  }

  /**
   * Elimina un registro de transacción de la base de datos.
   */
  deleteTransaccion(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/transaccion/${id}`);
  }

}