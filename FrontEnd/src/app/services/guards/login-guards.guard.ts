import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuardsGuard implements  CanActivate {

  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

  constructor(private usuarioService: UsuarioService, private roter: Router) {}

  canActivate( ): boolean {
    if (this.usuarioService.estaLogueado()) {
      return true;
    } else {
    this.roter.navigate(['/login']);
    return false;
    }
  }

}
