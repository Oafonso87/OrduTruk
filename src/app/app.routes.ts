import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { DemandasComponent } from './pages/demandas/demandas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Registro } from './pages/registro/registro';
import { Acceso } from './pages/acceso/acceso';
import { OfertasDetalle } from './pages/ofertas-detalle/ofertas-detalle';
import { CrearOfertas } from './pages/crear-ofertas/crear-ofertas';
import { Perfil } from './pages/perfil/perfil';
import { Mensajes } from './pages/mensajes/mensajes';
import { DemandasDetalle } from './pages/demandas-detalle/demandas-detalle';
import { authGuard } from './guards/auth-guard';
import { TerminosUso } from './pages/terminos-uso/terminos-uso';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ofertas', component: OfertasComponent, canActivate:[authGuard] },
    // { path: 'ofertasdetalle', component: OfertasDetalle, canActivate:[authGuard] },
    { path: 'ofertasdetalle/:id', component: OfertasDetalle, canActivate: [authGuard] },
    { path: 'crearoferta', component: CrearOfertas, canActivate:[authGuard] },
    { path: 'demandas', component: DemandasComponent, canActivate:[authGuard] },
    { path: 'demandasdetalle', component: DemandasDetalle, canActivate:[authGuard] },
    { path: 'usuarios', component: UsuariosComponent, canActivate:[authGuard] },
    { path: 'quienes-somos', component: QuienesSomos },
    { path: 'terminos-uso', component: TerminosUso },
    { path: 'registro', component: Registro },
    { path: 'acceso', component: Acceso },
    { path: 'perfil', component: Perfil, canActivate:[authGuard] },
    { path: 'mensajes', component: Mensajes, canActivate:[authGuard] },
    { path: '**', component: HomeComponent }
];
