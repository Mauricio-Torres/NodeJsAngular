import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificarTokenGuard implements CanActivate  {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(public usuarioService: UsuarioService) {

  }

  canActivate(): Promise<boolean> | boolean {
    const token = this.usuarioService.token;
    // obtiene la informacion del token
    const payload = JSON.parse(atob(token.split('.')[1])); // la fecha esta en segundos y se obtiene con exp

    const expiro = this.expiroToken(payload.exp);

    if (expiro) {
      this.usuarioService.logout();
      return false; // el usuariuo no debe poder entrar a ninguna pag si el token expiro
    }

    return this.verificarRenovarToken(payload.exp);
  }


  verificarRenovarToken(fechaExpiracionToken: any): Promise<boolean> {

    return new Promise( (resolve, reject) => {
        const tokenExpira = new Date(fechaExpiracionToken * 1000);
        const ahora = new Date();

        // se aumenta la fecha en 30 minutos => siempre debe aumentarse en 1000 porq el getTime() extrae la fecha en milisegundos....
        // esta fecha valida si el token le fgalta 30 minutos se va a actualizar pidiendo otro token ....
        ahora.setTime( ahora.getTime() + 30 * 60 * 1000);

        if (tokenExpira.getTime() > ahora.getTime()) {
          resolve(true);
        } else {
          this.usuarioService.renovarToken().subscribe(
            () => { resolve(true) },
            () => { reject(false) }
          );
        }
    });
  }

  expiroToken(fechaTokenExpiro: any) {
    // obtiene la fecha de este instante
    const fechaAhora = new Date().getTime() / 1000; // se deben pasar a segundos esta fecha vine en milisegundos
    if (fechaTokenExpiro < fechaAhora) {
      return true; // retorna true si el token ya expiro
    } else {
      return false; // retorna false si el token no a expirado
    }
  }
}
