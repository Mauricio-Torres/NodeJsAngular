import { Router } from '@angular/router';
import { Usuario } from './../../models/usuario.model';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/service.index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;
  constructor(public servicioUsuario: UsuarioService, public router: Router) { }

  ngOnInit() {

    this.usuario = this.servicioUsuario.usuario;
  }

  buscar(termino: any) {
      this.router.navigate(['/busqueda', termino])
  }

}
