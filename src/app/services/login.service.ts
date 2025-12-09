import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { LoginRequest } from "../models/loginrequest";
import { LoginResponse } from "../models/loginresponse";

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

}