import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {



    this.promesa().then (
     () => console.log('Termino')
   ).catch(() => console.log('algo salio mal'));
  }

  ngOnInit() {
  }

  promesa(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let contador = 0;
      setInterval(() => {
        contador++;

        if (contador === 3 ) {
          resolve(true);
        }
      }, 1000);
    });
  }
}
