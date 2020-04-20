import { Injectable } from '@angular/core';
import { URL_SERVICE } from 'src/app/Config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo(archivo: File, tipo: string, id: any) {

    console.log('el tipo seleccionado es ' + tipo)
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 ) {
          if (xhr.status === 200) {
            resolve( JSON.parse( xhr.response));
          } else {
            reject(JSON.parse(xhr.response));
          }
        }
      };
      const url = URL_SERVICE + '/uploads/' + tipo + '/' + id;
      xhr.open('PUT', url, true);
      xhr.send(formData);

    });
  }
}
