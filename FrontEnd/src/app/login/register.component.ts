import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';


declare function init_plugin();
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(private formBuilder: FormBuilder, public _usuarioService: UsuarioService, public router: Router) {

    init_plugin();
  }

  ngOnInit() {

    this.forma = this.formBuilder.group({
      nombre: new FormControl( null, Validators.required ),
      correo: new FormControl( null, [Validators.required, Validators.email] ),
      password: new FormControl( null, [Validators.required  ] ), // this.validatePassword, Validators.minLength(4)
      password2: new FormControl( null, [Validators.required ] ),
      condiciones: new FormControl(false)

    },  {validators: this.validacion('password', 'password2')});


  }

  private validatePassword(control: AbstractControl) {

    const password = control.value;
    if (password) {
      let error = null;
      if (!password.includes('.')) {
        error = { ...error, dollar: 'Incluir un .' };
      }
      if (!parseFloat(password[0])) {
        error = { ...error, number: 'Incluir un nùmero' };
      }
      return error;
    }
  }

  validacion( dato1: any, dato2: any) {
    return (group: FormGroup) => {
      const pass1 = group.controls[dato1].value;
      const pass2 = group.controls[dato2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true
      };
    };
  }

  registrarUsuario(){

    if (!this.forma.value.condiciones) {
      Swal.fire({
        title: 'Terminos y Condiciones ',
        text: 'Debe seleccionar los terminos y condiciones',
        type: 'error',
        confirmButtonText: 'Aceptar'
      });

      return;
    }

    if (this.forma.valid) {
      const usuario = new Usuario (
        this.forma.value.nombre,
        this.forma.value.correo,
        this.forma.value.password);

      this._usuarioService.crearUsuario( usuario ).subscribe(
            data => { console.log(data); this.router.navigate(['/login']); },
            error => {
              Swal.fire({
                title: 'Error!',
                text: '' + error.message,
                type: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
        );

  } else {

    Swal.fire({
      title: 'Error!',
      text: 'El formulario no esta completo',
      type: 'error',
      confirmButtonText: 'Aceptar'
    });
    return;
  }



  }
}
