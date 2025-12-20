import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Provincias } from "../models/provincias";
import { Poblaciones } from "../models/poblaciones";


@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  getProvincias(): Observable<ApiResponse<Provincias[]>> {
    return this._http.get<ApiResponse<Provincias[]>>(`${this.url}/getProvincias`);
  }

  getProvinciasById(id: number): Observable<ApiResponse<Provincias[]>> {
    return this._http.get<ApiResponse<Provincias[]>>(`${this.url}/getProvincias/${id}`);
  }

  getPoblaciones(): Observable<ApiResponse<Poblaciones[]>> {
    return this._http.get<ApiResponse<Poblaciones[]>>(`${this.url}/getPoblaciones`);
  }

  getPoblacionesById(id: number): Observable<ApiResponse<Poblaciones[]>> {
    return this._http.get<ApiResponse<Poblaciones[]>>(`${this.url}/getPoblaciones/${id}`);
  }  

}