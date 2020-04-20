import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {


  imgSubir: File;
  imgTemp: any;

  constructor(public subirArchivoService: SubirArchivoService, public modalUploadService: ModalUploadService ) { }

  ngOnInit() {
  }

  subirImagen() {
      this.subirArchivoService.subirArchivo(this.imgSubir, this.modalUploadService.tipo, this.modalUploadService.id)
      .then(resp => {
         this.cerrarMOdal();
         this.modalUploadService.notificacion.emit(resp);


      }).catch( err => {

        this.cerrarMOdal();
        Swal.fire({
          title: 'Error al cargar Imagen',
          text: 'Se produjo un error al cargar la imagen ' + JSON.stringify(err) ,
          type: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.log(err);
      });
  }

  cerrarMOdal() {
    this.imgSubir = null;
    this.imgTemp = null;
    this.modalUploadService.ocultarModal();
  }

  seleccionImg(event: any) {
    console.log(this.imgTemp);
    if (this.imgTemp != undefined || this.imgTemp != null){
      this.imgTemp = null;
    }
    if (!event) {
      this.imgSubir = null;
      return;
    }
    const file = event.target.files[0]; // recupera ubicacion de la imagen
    //console.log(this.imgTemp);

    if (file.type.indexOf('image') < 0) {

      Swal.fire({
        title: 'Solo Imagenes',
        text: 'El archivo seleccionado no es una imagen ',
        type: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.imgSubir = null;
      return;
    }

    this.imgSubir = file;

    // javascript puro para visualizar la imagen apenas seleccione
    // se crea esto para convertir la img a base 64 y poderla mapear en la vista
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      // convierte una img en base 64
      this.imgTemp = reader.result;

    };
  }

}
