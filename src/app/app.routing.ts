import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PanelDeControlComponent } from './components/admin/panel-de-control/panel-de-control.component';
import { ObjetivosComponent } from './components/admin/objetivos/objetivos.component';
import { RolesComponent } from './components/admin/roles/roles.component';
import { UsuariosComponent } from './components/admin/usuarios/usuarios.component';


const routes: Routes = [
    { path: '', component: LoginComponent },//cuando el path este vacio que nos cargue el login
    { path: 'login', component: LoginComponent },//cuando el path sea login que nos cargue el login
    { path: 'dashboard', component: DashboardComponent },
    { path: 'panel-de-control', component: PanelDeControlComponent },
    { path: 'objetivos', component: ObjetivosComponent },
    { path: 'roles', component: RolesComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: '**', component: LoginComponent }//cuando la ruta no exista nos muestra el login
];


export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes); //cargamos las rutas
