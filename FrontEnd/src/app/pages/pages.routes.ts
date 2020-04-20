import { MedicosComponent } from './medicos/medicos.component';
import { ProfileComponent } from './profile/profile.component';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafficas1Component } from './grafficas1/grafficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { LoginGuardsGuard, AdminGuard } from '../services/service.index';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicoComponent } from './medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { VerificarTokenGuard } from '../services/guards/verificar-token.guard';

const pageRoutes: Routes = [
      {
        path: 'dashboard',
        canActivate: [ VerificarTokenGuard ],
        component: DashboardComponent,
        data: { titulo: 'Dashboard' }
      },
      { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
      { path: 'graficas1', component: Grafficas1Component, data: { titulo: 'Graficas' } },
      { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
      { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
      { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de Tema' } },
      { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de Usuario' } },
      { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Mantenimiento de usuarios' } },
      { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales' } },
      { path: 'medicos', canActivate:[ AdminGuard ], component: MedicosComponent, data: { titulo: 'Mantenimiento de Medicos' } },
      { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Actualizar Medico' } },
      { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Busqueda General' } },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
/**
 * ruta secundarias que se extraen para tener diferentes componentes
 */
export const PAGES_ROUTE = RouterModule.forChild(pageRoutes);
