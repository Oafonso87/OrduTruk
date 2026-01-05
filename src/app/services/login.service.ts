import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { LoginRequest } from "../models/loginrequest";
import { LoginResponse } from "../models/loginresponse";
import { ApiResponse } from "../models/apiresponse";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.url}/login`, credenciales);  
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this._http.post<any>(`${this.url}/logout`, {}, { headers });
  }


  cambiarContraseña(id: number, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('password', password);  
    return this._http.post<any>(`${this.url}/users/${id}/change-password`, formData);
  }

}