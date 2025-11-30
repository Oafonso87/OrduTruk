import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Usuarios } from "../models/usuarios";



@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url: string = 'https://garcia-conde-jose-dwes04-te01.onrender.com/api/post/get';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  getUsuarios(): Observable<ApiResponse<Usuarios[]>> {
    return this._http.get<ApiResponse<Usuarios[]>>(this.url);
  }

  //   getUsuarioById(id: number): Observable<ApiResponse<Login>> {
  //     return this._http.get<ApiResponse<Login>>(`${this.url}/${id}`);
  //   }

  //   createUsuario(login: Login): Observable<ApiResponse<Login>> {
  //     return this._http.post<ApiResponse<Login>>(this.url, login, this.httpOptions);
  //   }

  //   updateUsuario(login: Login): Observable<ApiResponse<Login>> {
  //     return this._http.put<ApiResponse<Login>>(`${this.url}/${login.id}`, login, this.httpOptions);
  //   }

  //   deleteUsuario(id: number): Observable<ApiResponse<any>> {
  //     return this._http.delete<ApiResponse<any>>(`${this.url}/${id}`);
  //   }

}