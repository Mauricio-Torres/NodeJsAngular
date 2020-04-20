import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  forma: FormGroup;
  usuario: Usuario;
  bloquearCorreo = false;
  imgSubir: File;
  imgTemp: any;

  constructor(public servicioUsuario: UsuarioService, private formBuilder: FormBuilder) {
    this.usuario = this.servicioUsuario.usuario;
    this.bloquearCorreo = this.usuario.google;

  }

  ngOnInit() {

    this.forma = new FormGroup ({
      nombre: new FormControl( this.usuario.nombre, Validators.required ),
      correo: new FormControl( this.usuario.email, [Validators.required, Validators.email] )
    });
  }

  editarUsuario(forma: any) {

    this.usuario.nombre = forma.value.nombre;
    if ( !this.usuario.email) {

      this.usuario.email =  forma.value.correo;

    }
    this.servicioUsuario.actualizarUsuario(this.usuario).subscribe( resp => {
      Swal.fire({
        title: 'Actualizacion Completa',
        text: 'el usuario fue actualizado con exito ',
        type: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.imgSubir = null;
    });
  }

  seleccionImg(event: any) {
    if (!event) {
      this.imgSubir = null;
      return;
    }
    const file = event.target.files[0];

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

  guardarImg() {
    if (this.imgSubir === null || this.imgSubir === undefined) {

      this.imgTemp = null;
      this.servicioUsuario.cambiarImg( this.imgSubir, this.usuario._id );

    } else {
      Swal.fire({
        title: 'Seleccione una Imagen',
        text: 'Seleccione una imagen',
        type: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.imgSubir = null;
    }

  }
}
