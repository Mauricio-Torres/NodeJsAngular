import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import { HospitalService } from 'src/app/services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit, AfterViewInit {

  hospitalSelect: Hospital = new Hospital('', '', '');
  medico = new Medico;
  mostrarHospital = false;
  cargando = false;
  hospitales: Hospital[] = [];
  medicos: any[] = [];
  totalMedicos = 0;
  forma: FormGroup;
  idMedico: any;
  selectOne: Hospital = new Hospital('', '', '');

  constructor(private formBuilder: FormBuilder,
              public medicoService: MedicoService,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public modalUploadService: ModalUploadService,
              public hospitalesService: HospitalService) {

                this.cargarHospitales();
   }

  ngOnInit() {

    this.forma = this.formBuilder.group({
      nombre: new FormControl( null, Validators.required ),
      hospital: new FormControl( this.hospitales[0], [Validators.required] ),
    });
    this.modalUploadService.notificacion.subscribe( (res: any) => {
      this.medico.img = res.medico.img;
     });
  }

  ngAfterViewInit(): void {


    this.activatedRoute.params.subscribe (params => {
      this.idMedico = params.id;
    });

    if (this.idMedico !== 'nuevo') {

      this.medicoService.cargarMedico(this.idMedico).subscribe( (res: any) => {
        const hospital = this.hospitales.find( x => x._id === res.medico.hospital._id);
        this.medico = res.medico;
        this.forma.controls.nombre.setValue( this.medico.nombre);
        this.forma.controls.hospital.setValue(hospital);
        this.mostrarHospital = true;
        this.hospitalSelect = hospital;
      });
    }
   }

  onSubmit() {

    if (this.forma.valid) {

      if (this.forma.value.hospital._id === '') {
        Swal.fire({
          title: 'Seleccione Hospital',
          text: 'Debe seleccionar un hospital',
          type: 'error',
          confirmButtonText: 'Aceptar'
        });

        return;
      }

      const medico = new Medico();

      if (this.medico) {
        medico._id = this.medico._id;
        medico.img = this.medico.img;
      }

      medico.nombre = this.forma.value.nombre;
      medico.hospital = this.forma.value.hospital._id;

      if (this.idMedico !== 'nuevo') {

       this.actualizarMedico(medico);

      } else {

       this. crearMedico(medico);
      }

    } else {

      Swal.fire({
        title: 'Complete el formulario',
        text: 'Debe completar el formulario',
        type: 'error',
        confirmButtonText: 'Aceptar'
      });

      return;
    }
  }

  cargarHospitales() {

    this.hospitales.push(new Hospital('Seleccione Hospital', '', ''));

    this.hospitalesService.cargarHospitales().subscribe( (resp: any) => {
      resp.forEach(element => {
        this.hospitales.push(element);
      });
    });
  }

  actualizarMedico(medico: Medico) {

    this.medicoService.actualizarMedico(medico).subscribe( (result: any) => {
      this.router.navigate(['/medico/', result._id]);

    });
  }

  crearMedico(medico: Medico) {

    this.medicoService.crearMedico(medico).subscribe( (result: any) => {
      this.medico = result;
      this.router.navigate(['/medico/', result._id]);
    });
  }

  actualizarImagenMedico() {
    const idMedico = this.medico._id;
    this.modalUploadService.mostrarModal('medicos', idMedico);
  }

  cambioHospital() {

    const hospitalId = this.forma.value.hospital._id;
    if (hospitalId) {
      this.mostrarHospital = true;
      this.hospitalesService.cargarHospital(hospitalId).subscribe(result => {
        this.hospitalSelect = result;
      });
    } else {
      this.mostrarHospital = false;
    }
  }
}
