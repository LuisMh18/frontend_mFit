import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
    { path: '', component: LoginComponent },//cuando el path este vacio que nos cargue el login
    { path: 'login', component: LoginComponent },//cuando el path sea login que nos cargue el login
    { path: '**', component: LoginComponent }//cuando la ruta no exista nos muestra el login
];


export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes); //cargamos las rutas