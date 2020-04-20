import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICE } from '../Config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    const url = URL_SERVICE + '/img';

    if (!img) {
      return url + '/usuarios/xxx';
    }

    if (img.indexOf('https') >= 0) {
      return img;
     }

    switch (tipo) {

      case 'usuario':
          return url + '/usuarios/' + img;
      case 'medico':
          return url + '/medicos/' + img;
      case 'hospital':
          return url + '/hospitales/' + img;
      default:
          console.log('No existe el tipo: ' + tipo);
          return url + '/usuarios/xxx';
     }
  }

}
