import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router : Router, private authservice : AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    const currentUser = this.authservice.getCurrentUser();
    console.log(currentUser);
    if(currentUser){
      if(route.data.roles && route.data.roles.indexOf(currentUser.role.nomrole) === -1){
        this.router.navigate(['/unauthorized']);
        return false;
      }
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
