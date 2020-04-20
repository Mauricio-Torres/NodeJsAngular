import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICE } from '../../Config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Hospital } from '../../models/hospital.model';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales = 0;
  constructor( public http: HttpClient, public usuarioService: UsuarioService ) { }

  cargarHospitales() {

    const url = URL_SERVICE + '/hospital';

    return this.http.get(url).pipe(map( (resp: any) => {
      this.totalHospitales = resp.totalHospitales;
      return resp.Hospitales;
    }));
  }

  cargarHospital(idHospital: any) {

    const url = URL_SERVICE + '/hospital/' + idHospital;

    return this.http.get(url).pipe(map( (resp: any) => {
      return resp.hospital;
    }));
  }

  borrarHospital(idHospital: any) {

    const url = URL_SERVICE + '/hospital/' + idHospital + '?token=' + this.usuarioService.token;

    return this.http.delete(url).pipe(map( (resp: any) => {
      Swal.fire({
        title: 'Hospital Borrado',
        text: 'El hospital ' + resp.hospital.nombre + 'fue borrado exitosamente',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });
      return true;
    }));
  }

  crearHospital(nombreHospital: any) {

    const url = URL_SERVICE + '/hospital?token=' + this.usuarioService.token;

    return this.http.post(url, { nombre: nombreHospital } ).pipe(map( (resp: any) => {
      console.log(resp)

      Swal.fire({
        title: 'Hospital Creado',
        text: 'El hospital ' + resp.body.nombre + 'fue creado exitosamente',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });

      return true;
    }));
  }

buscarHospitales(terminoBusqueda: any) {
  const url = URL_SERVICE + '/busqueda/colecciones/hospitales/' + terminoBusqueda;
  return this.http.get(url).pipe( map( (resp: any) => {

    return resp.tabla;
  } ));
}

actualizarHospital(hospital: Hospital) {

  const token = localStorage.getItem('token');

  const url = URL_SERVICE + '/usuario/' + hospital._id + '?token=' + token;

  return this.http.put(url, hospital).pipe( map ((res: any) => {

    Swal.fire({
      title: 'Hospital Actualizado',
      text: 'El hospital ' + res.hospital.nombre + ' fue actualizado',
      type: 'success',
      confirmButtonText: 'Aceptar'
    });

    return true;
  }));

}



}
