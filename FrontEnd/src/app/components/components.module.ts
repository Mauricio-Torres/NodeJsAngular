import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from './grafico-dona/grafico-dona.component';
import { ModalUploadComponent } from './modal-upload/modal-upload.component';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    IncrementadorComponent,
    GraficoDonaComponent,
    ModalUploadComponent
  ],
  exports: [
    IncrementadorComponent,
    GraficoDonaComponent,
    ModalUploadComponent
  ],
  imports: [
    FormsModule,
    ChartsModule,
    PipesModule,
    CommonModule
  ]

})
export class ComponentsModule {}
