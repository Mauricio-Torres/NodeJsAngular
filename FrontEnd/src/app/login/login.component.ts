import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugin();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth2: any;
  correo = '';
  recuerdame = false;

  constructor(public router: Router, public _usuarioService: UsuarioService) { }

  ngOnInit() {
    init_plugin();
    this.googleInit();
    this.correo = localStorage.getItem('email') || '';

    if (this.correo.length > 1) {
      this.recuerdame = true;
    }

  }

 googleInit() {

  gapi.load('auth2', () => {
    this.auth2 = gapi.auth2.init({
      client_id: '147608031386-ijus4k48lalgj5l509rjpcn5vffpul6f.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      scope: 'profile email'
    });

    this.attachSinin(document.getElementById('btnGoogle'));
  });

}

attachSinin( element ) {
  this.auth2.attachClickHandler(element, {}, googleUser => {
    // let profile = googleUser.getBasicProfile(); // obtener mas datos de la cuenta de google
    const token = googleUser.getAuthResponse().id_token;

    this._usuarioService.loginGoogle(token).subscribe ( resp => {

      if (resp) {
        // tslint:disable-next-line: max-line-length
        // this.router.navigate(['/dashboard']); // no carga el componente ... pierde los valores y genera error cuando se usa esto toca recargar la pag para q funcione
         window.location.href = '#/dashboard'; // redireccionamiento mediante jquey javascript nativo
    }

    });

  });

}

  onSubmit(forma: NgForm) {

    console.log()
    console.log(forma.value)

    if (forma.invalid) {
      return;
    }

    const user = new Usuario(null, forma.value.email, forma.value.password);
    this._usuarioService.login(user, forma.value.recuerdame).subscribe (
        resp => { if (resp){this.router.navigate(['/dashboard']); }
      });
  }
}
