import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [Header, Footer, RouterLink, FormsModule, CommonModule],
  templateUrl: './acceso.html',
  styleUrl: './acceso.scss',
})
export class Acceso {

  constructor(private _loginService : LoginService, private _router : Router){}

  public email : string = '';
  public password : string = '';
  public mostrarPassword = false;

  /**
   * Gestiona el proceso de autenticación del usuario.
   * Envía las credenciales al servidor y, en caso de éxito, persiste la sesión.
   */
  acceder() {    
    const credenciales: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this._loginService.login(credenciales).subscribe({
      next: (response: LoginResponse) => {
        // Almacenamos el token JWT para el AuthInterceptor y los datos de usuario para la persistencia local
        localStorage.setItem('access_token', response.access_token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
        // Redirección al dashboard principal una vez autenticado correctamente
        this._router.navigate(['/ofertas']);
      },
      error: (err) => {
        // Notificamos el fallo de credenciales en forma de alert para que el usuario lo vea
        window.alert("Credenciales incorrectas. Inténtelo de nuevo.");
        console.error('Error de login:', err);       
      }
    });
  }   

  // Alterna la visibilidad de los caracteres del campo contraseña en el formulario
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

}
  


