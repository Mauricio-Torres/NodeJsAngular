import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(public usuarioService: UsuarioService) {

  }

  // tslint:disable-next-line: max-line-length
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const rol = this.usuarioService.usuario.role;

    return true;
   /*
    if (rol === 'ADMIN_ROLE') {
      return true;
    } else {
      this.usuarioService.logout();
      return false;
    }
*/
  }

}
