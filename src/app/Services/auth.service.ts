import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../Models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user : User;

  constructor(private userservice : UserService , 
              private router : Router,
              private toastr : ToastrService) {
   }
   


  async authenticate(username) {
      this.userservice.findUserByEmail(username).subscribe(
       async (response : User) => {
        if(response.active === "active"){
        await sessionStorage.setItem('user' , JSON.stringify(response))
        this.showSuccess()
        this.router.navigate([''])
      }
        else this.showError()
       }
     )
      return true;
    }

  getCurrentUser(){
    let user = JSON.parse(sessionStorage.getItem('user'));
    if(user){
      return user;
  } 
    else return null

  }

  logout(){
    sessionStorage.removeItem('user')
  }

  showSuccess() {
    this.toastr.success(`Bienvenue ${this.getCurrentUser().nom} !! `);
    }

  showError() {
    this.toastr.error('Ce Compte est inactive !');
  }
}
