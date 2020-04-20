import { SidebarService } from 'src/app/services/service.index';
import { Usuario } from './../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;

  // tslint:disable-next-line: variable-name
  constructor(public _sideBarService: SidebarService, public servicioUsuario: UsuarioService) { }

  ngOnInit() {

    this.usuario = this.servicioUsuario.usuario;
    this._sideBarService.cargarMenu();
  }

}
