import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default-dark.css',
    tema: 'default'
  }
  constructor(@Inject(DOCUMENT) private document) {
    this.loadAjustes();
  }

  /**
   * ingresamos el tema al local storage
   */
  saveAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }
  /**
   * extraemos el tema del local storage
   */
  loadAjustes() {
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse (localStorage.getItem('ajustes'));

      // cargamos el color
      this.cambiarColor(this.ajustes.tema);
    }
  }

  /**
   * asigna un color al header y a la barra lateral
   * @param tema nombre del tema
   */
  cambiarColor(tema: any) {

    const url = `assets/css/colors/${tema}.css`;
    this.document.getElementById('themeChange').setAttribute('href', url);
    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;

    this.saveAjustes();
  }
}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
