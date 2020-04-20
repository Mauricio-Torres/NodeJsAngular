import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URL_SERVICE } from 'src/app/Config/config';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  hospitales: any[] = [];
  medicos: any[] = [];
  usuarios: any[] = [];

  constructor(public activatedRoute: ActivatedRoute, public http: HttpClient, public router: Router) {

    activatedRoute.params.subscribe (params => {
      const termino = params.termino;
      if (termino){
        this.busqueda(termino);
      } else {

        this.router.navigate(['/dashboard']);
      }

    });

  }

  ngOnInit() {

  }

  busqueda(termino: any) {
    const url = URL_SERVICE + '/busqueda/todo/' + termino;

    this.http.get(url).subscribe(
      (data: any) => {
        this.usuarios = data.usuarios;
        this.medicos = data.medicos;
        this.hospitales = data.hospitales;

      }
    );
  }
}
