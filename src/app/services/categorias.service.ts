import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Categorias } from "../models/categorias";


@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  getCategorias(): Observable<ApiResponse<Categorias[]>> {
    return this._http.get<ApiResponse<Categorias[]>>(`${this.url}/getCategorias`);
  }

  getCategoriasById(id: number): Observable<ApiResponse<Categorias[]>> {
    return this._http.get<ApiResponse<Categorias[]>>(`${this.url}/getCategorias/${id}`);
  }

}