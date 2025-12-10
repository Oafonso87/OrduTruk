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

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ofertas', component: OfertasComponent },
    { path: 'ofertasdetalle', component: OfertasDetalle },
    { path: 'crearoferta', component: CrearOfertas },
    { path: 'demandas', component: DemandasComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'quienes-somos', component: QuienesSomos },
    { path: 'registro', component: Registro },
    { path: 'acceso', component: Acceso },
    { path: 'perfil', component: Perfil },
    { path: 'mensajes', component: Mensajes },
    { path: '**', component: HomeComponent }
];
