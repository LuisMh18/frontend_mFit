import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//notificaciones
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';

//primeng ----
import {DialogModule} from 'primeng/dialog';
import {InputSwitchModule} from 'primeng/inputswitch';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

import {TabViewModule} from 'primeng/tabview';

//https://www.npmjs.com/package/ngx-ui-switch
import { UiSwitchModule } from 'ngx-ui-switch';

//rutas
import { routing, appRoutingProviders } from './app.routing';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { PanelDeControlComponent } from './components/admin/panel-de-control/panel-de-control.component';
import { ObjetivosComponent } from './components/admin/objetivos/objetivos.component';
import { RolesComponent } from './components/admin/roles/roles.component';
import { UsuariosComponent } from './components/admin/usuarios/usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PanelDeControlComponent,
    ObjetivosComponent,
    RolesComponent,
    UsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    routing,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputSwitchModule,
    UiSwitchModule,
    ConfirmDialogModule,
    TabViewModule

  ],
  providers: [
      appRoutingProviders,
      ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
