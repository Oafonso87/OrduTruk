import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/apiresponse";
import { Mensaje } from "../models/mensaje";




@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  private url: string = 'https://proyecto-daw-backend.onrender.com/api/mensajes';
  private url2: string = 'https://proyecto-daw-backend.onrender.com/api/mensaje';


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public _http: HttpClient) { }


  getMensajes(): Observable<ApiResponse<Mensaje[]>> {
    return this._http.get<ApiResponse<Mensaje[]>>(this.url);
  }

  getMensajesById(id: number): Observable<ApiResponse<Mensaje[]>> {
    return this._http.get<ApiResponse<Mensaje[]>>(`${this.url}/${id}`);
  }

  createMensaje(mens: Mensaje): Observable<ApiResponse<Mensaje>> {
    return this._http.post<ApiResponse<Mensaje>>(this.url2, mens, this.httpOptions);
  }

  updateMensaje(mens: Mensaje): Observable<ApiResponse<Mensaje>> {
    return this._http.put<ApiResponse<Mensaje>>(`${this.url}/${mens.id}`, mens, this.httpOptions);
  }

  deleteMensaje(id: number): Observable<ApiResponse<any>> {
    return this._http.delete<ApiResponse<any>>(`${this.url}/${id}`);
  }

}