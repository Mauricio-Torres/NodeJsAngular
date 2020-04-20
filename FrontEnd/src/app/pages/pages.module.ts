import { NgModule } from '@angular/core';

// separacion completa de modulo
import { SharedModule } from '../shared/shared.module';

// importamos las rutas
import { PAGES_ROUTE } from './pages.routes';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafficas1Component } from './grafficas1/grafficas1.component';

import { ComponentsModule } from '../components/components.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

// pipe module para cargar img y otras transformaciones
import { PipesModule } from '../pipes/pipes.module';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafficas1Component,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    ProfileComponent,
    UsuariosComponent,
    HospitalesComponent,
    MedicosComponent,
    MedicoComponent,
    BusquedaComponent
    ],
  exports: [
    DashboardComponent,
    ProgressComponent,
    Grafficas1Component
  ],
  imports: [
    SharedModule,
    PipesModule,
    PAGES_ROUTE,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
    ]

})
export class PagesModule {}
