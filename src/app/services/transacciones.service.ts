import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Transacciones } from "../models/transacciones";


@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  getTransacciones(): Observable<ApiResponse<Transacciones[]>> {
    return this._http.get<ApiResponse<Transacciones[]>>(`${this.url}/transacciones`);
  }

  getTransaccionesById(id: number): Observable<ApiResponse<Transacciones[]>> {
    return this._http.get<ApiResponse<Transacciones[]>>(`${this.url}/transacciones/${id}`);
  }

  createTransaccion(transaccion: any): Observable<ApiResponse<Transacciones>> {
    return this._http.post<ApiResponse<Transacciones>>(`${this.url}/transaccion`, transaccion, this.httpOptions);
  }

  updateTransaccion(transaccion:any): Observable<ApiResponse<Transacciones>> {
    return this._http.put<ApiResponse<Transacciones>>(`${this.url}/transaccion/${transaccion.id}`, transaccion, this.httpOptions);
  }

  deleteTransaccion(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/transaccion/${id}`);
  }

}