import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  CurrentUser : User;
  ancienPass = '';
  newPass = '';
  confirmPass = '';

  constructor(private authservice : AuthService,
              private userservice : UserService,
              private toastr : ToastrService,
              private router : Router) { }

  ngOnInit(): void {
   this.userservice.getUser(this.authservice.getCurrentUser().idUser).subscribe(
     (response : User) => this.CurrentUser = response
   )
  }


  changePassword(){
    if(this.ancienPass === this.CurrentUser.password){
      if(this.newPass !== '' && this.newPass === this.confirmPass){
       this.userservice.updateUser({...this.CurrentUser,
                                    password : this.newPass},
                                    this.CurrentUser.idUser,
                                    this.CurrentUser.role.id).subscribe(
         (response) => {
           this.showSuccess();
           this.router.navigate(['logout'])
         }
       )
       
      }
      else this.showNewError()
    }
    else this.showAncienError();
  }

  showSuccess() {
    this.toastr.success('Mot de passe modifié avec succée !');
  }
    
  showAncienError() {
    this.toastr.error("L'ancien mot de passe est incorrect !");
  }

  showNewError() {
    this.toastr.error("les mots de passe ne correspondent pas !");
  }

}
