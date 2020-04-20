import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { URL_SERVICE } from 'src/app/Config/config';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: any;
  token: any;
  menu: any[] = [];

  constructor( public htpp: HttpClient, public router: Router, public subirArchivo: SubirArchivoService) {

    this.cargarToken();
  }

estaLogueado() {

  if ( this.token) {
    if (this.token.length) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

renovarToken() {
  const url = URL_SERVICE + '/login/renuevatoken?token=' + this.token;

  return this.htpp.get(url).pipe(map( (res: any) => {

    this.token = res.token;
    localStorage.setItem('token', res.token);
    return true;
  } ),
  catchError( (err: any) => {
    Swal.fire({
      title: 'ERROR',
      text: err.error.messaje,
      type: 'error',
      confirmButtonText: 'Aceptar'
    });

    this.logout();
    // tslint:disable-next-line: deprecation
    return Observable.throw(err); })

  );

}

cargarToken() {

  try {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
      this.menu = JSON.parse( localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.menu = [];
      this.usuario = null;
    }
  } catch {
    this.logout();
  }
}

guardarLocalStorage( id: string, token: string, usuario: any, menu: any) {

  localStorage.setItem('id', id);
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario) );
  localStorage.setItem('menu', JSON.stringify(menu) );

  this.usuario = usuario;
  this.token = token;
  this.menu = menu;
}

loginGoogle(token: string) {
  const url = URL_SERVICE + '/login/google';

  // se adiciona  post(url, { token }) para denotar que envia un objeto asi es mapeado la palabra token por el servidor ....

  return this.htpp.post(url, { token }).pipe( map ((res: any) => {

    this.guardarLocalStorage (res.id, res.token, res.usuario, res.menu);
    return true;
  }));
}

logout() {

  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('menu');
  this.usuario = null;
  this.menu = [];
  this.token = '';
  this.router.navigate(['/login']);
}

login( usuario: Usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else  {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICE + '/login';
    return this.htpp.post(url, usuario).pipe( map((res: any) => {

      this.guardarLocalStorage (res.id, res.token, res.usuario, res.menu );

      return true;
    }),
    catchError( (err: any) => {
      Swal.fire({
        title: 'ERROR',
        text: err.error.messaje,
        type: 'error',
        confirmButtonText: 'Aceptar'
      });

      // tslint:disable-next-line: deprecation
      return Observable.throw(err); })

      );}

crearUsuario( datos: Usuario) {
  const url = URL_SERVICE + '/usuario';
  return this.htpp.post(url, datos).pipe(map((res: any) => {
    Swal.fire({
      title: 'Usuario Creado',
      text: 'El usuario con el correo ' + ' fue creado',
      type: 'success',
      confirmButtonText: 'Aceptar'
    });
    return res.usuario;
  }),
  catchError( (err: any) => {
    Swal.fire({
      title: 'ERROR',
      text: err.error.messaje,
      type: 'error',
      confirmButtonText: 'Aceptar'
    });

    // tslint:disable-next-line: deprecation
    return Observable.throw(err); })

  );
}

actualizarUsuario(usuario: Usuario) {

  const token = localStorage.getItem('token');

  const url = URL_SERVICE + '/usuario/' + usuario._id + '?token=' + token;

  return this.htpp.put(url, usuario).pipe( map ((res: any) => {

    if (usuario._id === this.usuario._id) {

      const usuarioDB: Usuario = res.usuario;
      this.guardarLocalStorage (usuarioDB._id, this.token, usuarioDB, this.menu);
    }

    Swal.fire({
      title: 'Usuario Actualizado',
      text: 'El usuario ' + res.usuario.nombre + ' fue actualizado',
      type: 'success',
      confirmButtonText: 'Aceptar'
    });

    return true;
  }),
  catchError( (err: any) => {
    Swal.fire({
      title: 'ERROR',
      text: err.error.messaje,
      type: 'error',
      confirmButtonText: 'Aceptar'
    });

    // tslint:disable-next-line: deprecation
    return Observable.throw(err); })

  );

}

cambiarImg(file: File, id: any) {

  this.subirArchivo.subirArchivo(file, 'usuarios', id)
  .then( (resp: any) => {

    this.usuario.img = resp.usuario.img;

    this.guardarLocalStorage (this.usuario._id, this.token, this.usuario, this.menu);

    Swal.fire({
      title: 'Usuario Actualizado',
      text: 'El usuario ' + this.usuario.nombre + ' fue actualizado',
      type: 'success',
      confirmButtonText: 'Aceptar'
    });

    })
  .catch(resp => { console.log(resp); } );
}

cargarUsuarios(desde: number = 0) {

  const url = URL_SERVICE + '/usuario?desde=' + desde;
  return this.htpp.get(url);
}

buscarUsuarios(terminoBusqueda: any) {
  const url = URL_SERVICE + '/busqueda/colecciones/usuarios/' + terminoBusqueda;
  return this.htpp.get(url).pipe( map( (resp: any) => {

    console.log('desde front...');
    console.log(resp.tabla);
    return resp.tabla;
  } ),
  catchError( (err: any) => {
    Swal.fire({
      title: 'ERROR',
      text: err.error.messaje,
      type: 'error',
      confirmButtonText: 'Aceptar'
    });

    // tslint:disable-next-line: deprecation
    return Observable.throw(err); })
  ); }

borrarUsuario(idUsuario: any) {
  const url = URL_SERVICE + '/usuario/' + idUsuario + '?token=' + this.token;
  return this.htpp.delete(url);
}

}
