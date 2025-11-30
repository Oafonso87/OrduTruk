import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { DemandasComponent } from './pages/demandas/demandas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'ofertas', component: OfertasComponent },
    { path: 'demandas', component: DemandasComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: '**', component: HomeComponent }
];
