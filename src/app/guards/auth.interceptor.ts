import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional para la gestión de autenticación.
 * Se encarga de adjuntar automáticamente el token JWT en cada petición saliente.
 */
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Recuperamos el token de acceso almacenado durante el login
  const token = localStorage.getItem('access_token');

  // Si el token existe, clonamos la petición original e inyectamos la cabecera Authorization.   
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req);
  
};