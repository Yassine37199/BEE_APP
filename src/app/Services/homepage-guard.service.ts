import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RolesType } from '../Roles.types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomepageGuardService {

  constructor(private router : Router, private authservice : AuthService) { }

  canActivate(){
    const currentUser = this.authservice.getCurrentUser();
    console.log(currentUser);
    if(currentUser){
      if(currentUser.role.nomrole === RolesType.AGENT_RECOUVREMENT_RESILIATION){
        this.router.navigate(['/homepage-recouv']);
      }
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}
