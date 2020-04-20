import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICE } from 'src/app/Config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: any;

  constructor(public http: HttpClient) { }

  cargarMedicos() {
    const url = URL_SERVICE + '/medico';

    return this.http.get(url).pipe(map( (resp: any) => {
      return resp;
    }));
  }

  cargarMedico(id: any) {
    const url = URL_SERVICE + '/medico/' + id;

    return this.http.get(url).pipe(map( (resp: any) => {
      return resp;
    }));
  }

  buscarMedicos(terminoBusqueda: any) {
    const url = URL_SERVICE + '/busqueda/colecciones/medicos/' + terminoBusqueda;
    return this.http.get(url).pipe( map( (resp: any) => {

      return resp.tabla;
    } ));
  }

  borrarMedico(idMedico: any) {
    const token = localStorage.getItem('token');
    const url = URL_SERVICE + '/medico/' + idMedico + '?token=' + token;
    return this.http.delete(url).pipe ( map( (res: any) => {

      console.log(res);

      Swal.fire({
        title: 'Medico Borrado',
        text: 'El usuario ' + res.messaje.nombre + ' fue eliminado',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });

      return true;
    }));
  }

  crearMedico(medico: Medico ) {
    const token = localStorage.getItem('token');
    const url = URL_SERVICE + '/medico/?token=' + token;
    return this.http.post(url, medico).pipe ( map( (res: any) => {

      console.log(res);

      Swal.fire({
        title: 'Medico Creado',
        text: 'El Medico ' + res.body.nombre + ' fue creado',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });

      return  res.body;
    }));
  }

  actualizarMedico(medico: Medico ) {
    const token = localStorage.getItem('token');
    const url = URL_SERVICE + '/medico/' + medico._id + '?token=' + token;
    return this.http.put(url, medico).pipe ( map( (res: any) => {

      Swal.fire({
        title: 'Medico Actualizado',
        text: 'El Medico ' + res.medico.nombre + ' fue actualizado',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });

      return  res.medico;
    }));
  }
}
