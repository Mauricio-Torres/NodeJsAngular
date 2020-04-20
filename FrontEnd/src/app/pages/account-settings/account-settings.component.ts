import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor( public _settingService: SettingsService ) { }

  ngOnInit() {
    this.colocarCheck();
  }
  cambiarColor(tema: any, link: any) {

    this.cambiarCheck(link);
    this._settingService.cambiarColor(tema);
  }

  cambiarCheck(link: any) {
      let selectores: any = document.getElementsByClassName('selector');

      for (const ref of selectores ) {
        ref.classList.remove('working');
        console.log(ref);
      }

      link.classList.add('working');
  }
  colocarCheck() {

    let selectores: any = document.getElementsByClassName('selector');

    let tema = this._settingService.ajustes.tema;

    for (const ref of selectores ) {

      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
        break;
      }
    }
 }
}

