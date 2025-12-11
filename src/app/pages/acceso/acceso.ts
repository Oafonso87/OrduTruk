import { Component } from '@angular/core';
import { Button } from '../../components/button/button';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { RouterLink, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../models/loginrequest';
import { LoginResponse } from '../../models/loginresponse';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-acceso',
  standalone: true,
  imports: [Header, Footer, RouterLink, FormsModule],
  templateUrl: './acceso.html',
  styleUrl: './acceso.scss',
})
export class Acceso {

  constructor(private _loginService : LoginService, private _router : Router){}

  public email : string = '';
  public password : string = '';

  acceder() {    
    const credenciales: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this._loginService.login(credenciales).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login exitoso:', response);
        
        sessionStorage.setItem('access_token', response.access_token);
        
        this._router.navigate(['/ofertas']);
      },
      error: (err) => {
        window.alert("Credenciales incorrectas. Inténtelo de nuevo.");
        console.error('Error de login:', err);       
      }
    });
  }
  
}
  


