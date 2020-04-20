import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: ['./incrementador.component.css']
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('inputPorcentaje') inputPorcentaje: ElementRef;
  // tslint:disable-next-line: no-input-rename
  @Input('progreso') porcentaje: number;
  @Input() leyenda = '';

  @Output() progressEmit = new EventEmitter<number>();

  constructor() { }

  onCambiarProgress(dato: any) {

    this.porcentaje = this.porcentaje + dato;

    if (this.porcentaje >= 100 && dato > 0) {
      this.porcentaje = 100;
    }
    if (this.porcentaje <= 0 && dato < 0 ) {
      this.porcentaje = 0;
    }

    this.progressEmit.emit(this.porcentaje);
  }

  change(dat: any) {

    /* ingresar directamente a los componentes del DOM

    let elementHtml: any = document.getElementsByName('inputPorcentaje');
    elementHtml.value = this.porcentaje;*/

    this.porcentaje = dat;

    if (this.porcentaje >= 100 && dat > 0) {
      this.porcentaje = 100;
    }
    if (this.porcentaje <= 0 && dat < 0 ) {
      this.porcentaje = 0;
    }

    this.inputPorcentaje.nativeElement.value = this.porcentaje;
    this.progressEmit.emit(this.porcentaje);
  }

  ngOnInit() {
  }

}
