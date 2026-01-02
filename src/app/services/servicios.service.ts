import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Servicios } from "../models/servicios";



@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // };

  constructor(public _http: HttpClient) { }


  getServicios(): Observable<ApiResponse<Servicios[]>> {
    return this._http.get<ApiResponse<Servicios[]>>(`${this.url}/servicios`);
  }

  getServiciosById(id: number): Observable<ApiResponse<Servicios>> {
    return this._http.get<ApiResponse<Servicios>>(`${this.url}/servicio/${id}`);
  }

  createServicio(formData: FormData): Observable<ApiResponse<Servicios>> {
    return this._http.post<ApiResponse<Servicios>>(`${this.url}/servicio`, formData);
  }

  updateServicio(id: number, formData: FormData): Observable<ApiResponse<Servicios>> {
    return this._http.put<ApiResponse<Servicios>>(`${this.url}/servicio/${id}`, formData);
  }

  deleteServicio(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/servicio/${id}`);
  }

}