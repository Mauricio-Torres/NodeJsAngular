import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  progreso = 30;
  constructor() { }

  ngOnInit() {
  }

  onCambiarProgress(dato: any) {
    this.progreso = dato;
  }

}
