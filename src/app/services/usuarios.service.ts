import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Usuario } from "../models/usuarios";
import { LoginResponse } from "../models/loginresponse";


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private actualizarSaldoSource = new Subject<void>();
  actualizarSaldo$ = this.actualizarSaldoSource.asObservable();

  constructor(public _http: HttpClient) { }

  notificarCambioSaldo() {
    this.actualizarSaldoSource.next();
  }

  getUsuarios(): Observable<ApiResponse<Usuario[]>> {
    return this._http.get<ApiResponse<Usuario[]>>(`${this.url}/users`);
  }

  getUsuarioById(id: number): Observable<ApiResponse<Usuario>> {
    return this._http.get<ApiResponse<Usuario>>(`${this.url}/users/${id}`);
  }

  createUsuario(formData: FormData): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.url}/register`, formData);
  }  

  updateUsuario(id: number, formData: FormData): Observable<ApiResponse<Usuario>> {
    if (!formData.has('_method')) {
    formData.append('_method', 'PUT');
    }    
    return this._http.post<ApiResponse<Usuario>>(`${this.url}/users/${id}`, formData);
  }

  deleteUsuario(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/users/${id}`);
  }

}