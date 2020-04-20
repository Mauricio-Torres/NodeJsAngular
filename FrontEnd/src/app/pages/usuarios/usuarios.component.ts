import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {


  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = false;

  constructor( public usuarioService: UsuarioService, public modalUploadService: ModalUploadService) {


  }

  ngOnInit() {
    this.cargarUsuarios();

    this.modalUploadService.notificacion.subscribe(resp => { this.cargarUsuarios(); });
  }


  ngOnDestroy(): void {
    //this.modalUploadService.notificacion.unsubscribe()
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe((resp: any) => {
      this.totalRegistros = resp.totalUsuarios;
      console.log(resp.totalUsuarios);
      this.usuarios = resp.Usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(datos: any) {

    const desde = this.desde + datos;
    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde = this.desde + datos;
    this.cargarUsuarios();
  }

  buscarUsuarios(terminoBusqueda: any) {
    this.cargando = true;
    this.usuarioService.buscarUsuarios(terminoBusqueda)
    .subscribe((resp: any) => {

      // this.totalRegistros = resp.total;
      this.usuarios = resp;
      this.cargando = false;
    });
  }

  borrarUsuario(usuario: any) {

    if (this.usuarioService.usuario._id === usuario._id) {
      Swal.fire({
        title: 'No se puede Borrar',
        text: 'No puede borrarse a si mismo ',
        type: 'error',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro de Boorar el usuario?',
      text: 'Este proceso es irreversible!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar esto',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      // confirmacion para boorar o cancelar
      if (result.value) {

        swalWithBootstrapButtons.fire(
          'Borrado!',
          'El usuario ' + usuario.nombre + ' ha sido borrado' ,
          'success'
        );

        // borrar usuario....
        this.usuarioService.borrarUsuario(usuario._id).subscribe( resp => {
          console.log(resp);
          this.cargarUsuarios();
        });

      } else if ( result.dismiss === Swal.DismissReason.cancel)  {

        swalWithBootstrapButtons.fire(
          'Cancelar',
          'No se booro el usuario',
          'error'
        );
      }
    });
  }

  actualizarUsuario(usuario) {
    this.usuarioService.actualizarUsuario(usuario).subscribe( resp => {
      console.log(resp);
      this.cargarUsuarios();
    });
  }

  mostrarModal(usuarioId: any) {
      this.modalUploadService.mostrarModal('usuarios', usuarioId);
  }
}
