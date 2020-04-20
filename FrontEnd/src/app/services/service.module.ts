import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsService, SidebarService, SharedService,
         UsuarioService, LoginGuardsGuard, SubirArchivoService,
         HospitalService, MedicoService, AdminGuard, VerificarTokenGuard } from './service.index';

import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    MedicoService,
    SharedService,
    UsuarioService,
    SubirArchivoService,
    LoginGuardsGuard,
    VerificarTokenGuard,
    AdminGuard,
    ModalUploadService,
    HospitalService
  ]
})
export class ServiceModule { }
