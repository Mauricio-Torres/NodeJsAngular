import { Component, OnInit } from '@angular/core';
import { MedicoService } from 'src/app/services/service.index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {

 // medicos: Medico[] = [];
 cargando = false;
 medicos: any[] = [];
 totalMedicos = 0;
 constructor( public medicoService: MedicoService) { }

 ngOnInit() {
   this.cargarMedicos();
 }

 cargarMedicos() {
   this.medicoService.cargarMedicos().subscribe(
     res => {
       this.medicos = res.medicos;
       this.totalMedicos = res.totalMedico;
       console.log(res);
     });
 }

 buscarMedicos(termino: any) {
  if (termino.length === 0) {
    this.cargarMedicos();
    return;
  }
  this.medicoService.buscarMedicos(termino).subscribe(
    res => {
      // this.medicos = res.medicos;

      console.log(res);
    });
 }

 borrarMedico(IdMedico: any) {
  this.medicoService.borrarMedico(IdMedico).subscribe(
    res => {
      this.cargarMedicos();
      console.log(res);
    });
 }

 actualizarImagenMedico() {

 }

}
