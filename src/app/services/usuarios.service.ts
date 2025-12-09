import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Usuario } from "../models/usuarios";
import { LoginResponse } from "../models/loginresponse";



@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  getUsuarios(): Observable<ApiResponse<Usuario[]>> {
    return this._http.get<ApiResponse<Usuario[]>>(`${this.url}/users`);
  }

  getUsuarioById(id: number): Observable<ApiResponse<Usuario>> {
    return this._http.get<ApiResponse<Usuario>>(`${this.url}/users/${id}`);
  }

  createUsuario(user: Usuario): Observable<ApiResponse<LoginResponse>> {
    return this._http.post<ApiResponse<LoginResponse>>(`${this.url}/register`, user, this.httpOptions);
  }

  updateUsuario(user: Usuario): Observable<ApiResponse<Usuario>> {
    return this._http.put<ApiResponse<Usuario>>(`${this.url}/users/${user.id}`, user, this.httpOptions);
  }

  deleteUsuario(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/users/${id}`);
  }

}