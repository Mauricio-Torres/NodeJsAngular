import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-grafficas1',
  templateUrl: './grafficas1.component.html',
  styles: []
})
export class Grafficas1Component implements OnInit {



 public data = [[ 30, 60, 10]];
 public label = ['data 1', 'data 2', 'data 3'];
 public tipoGrafica = 'doughnut';

  constructor() { }

  ngOnInit() {
  }

}
