import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Valoraciones } from "../models/valoraciones";

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  getValoraciones(): Observable<ApiResponse<Valoraciones[]>> {
    return this._http.get<ApiResponse<Valoraciones[]>>(`${this.url}/valoraciones`);
  }

  getValoracionesById(id: number): Observable<ApiResponse<Valoraciones[]>> {
    return this._http.get<ApiResponse<Valoraciones[]>>(`${this.url}/valoraciones/${id}`);
  }

  createValoracion(valoracion: Valoraciones): Observable<ApiResponse<Valoraciones>> {
    return this._http.post<ApiResponse<Valoraciones>>(`${this.url}/valoracion`, valoracion, this.httpOptions);
  }

}