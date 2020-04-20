import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {


  cargando: boolean = false;
  totalHospitales = 0;
  hospitales: Hospital[] = [];

  constructor( public hospitalesService: HospitalService, public modalUploadService: ModalUploadService ) {

    this.cargarHospitales();
  }

  ngOnInit() {

    this.modalUploadService.notificacion.subscribe( () => { this.cargarHospitales(); } );

  }

  ngOnDestroy(): void {
    //this.modalUploadService.notificacion.unsubscribe();
  }

  cargarHospitales() {

    this.hospitalesService.cargarHospitales().subscribe( resp => {
      this.hospitales = resp;
    });

    this.totalHospitales = this.hospitalesService.totalHospitales;
  }

  buscarHospitales(input: any) {
    if (input.length === 0) {
      this.cargarHospitales();
      return;
    }
    this.hospitalesService.buscarHospitales(input).subscribe( resp => {
      this.hospitales = resp;
    });

  }

  crearHospital() {

    Swal.fire({
      title: 'Crear Hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Look up',
      showLoaderOnConfirm: true,
      preConfirm: (hospital) => {
        return this.hospitalesService.crearHospital(hospital).subscribe(
           resp => {  console.log(resp); this.cargarHospitales(); },
           error => {
            Swal.showValidationMessage(
              `Fallo Respuesta: ${error}`
            );
           }

        );
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        /*Swal.fire({
          title: `${result.value.login}'s avatar`,
          imageUrl: result.value.avatar_url
        })*/
        console.log(result)
      }
    });

  }

  actualizarHospital(hospital: any) {
    this.hospitalesService.actualizarHospital(hospital).subscribe( resp => {
      this.cargarHospitales();
    });
  }

  borrarHospital(hospital: any) {
    this.hospitalesService.borrarHospital(hospital._id).subscribe( resp => {
      this.cargarHospitales();
    });
  }

  actualizarImagenHospital(idHospital: any) {
    this.modalUploadService.mostrarModal('hospitales', idHospital);
  }
}
