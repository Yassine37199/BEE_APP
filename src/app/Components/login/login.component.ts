import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

const inputs = document.querySelectorAll(".input");

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})




export class LoginComponent implements OnInit {

  username : string;
  password : string;
  invalidLogin = false;
  user;
  closeResult = '';

  successMessage = "Authentication success";
  errorMessage = "Invalide username or password";

  constructor(private router : Router,
    private loginservice : AuthService,
    private userservice : UserService,
    private modalService : NgbModal) { }

  ngOnInit(): void {
    addcl();
    remcl();
  }


  checkLogin(){
    this.userservice.findUserByEmail(this.username).subscribe(
      response => {
        if(response) {
          if (this.password === response.password) {
            this.user = response
            
            this.loginservice.authenticate(this.username)
        } 
        else {
          this.invalidLogin = true;
        }
      }
      else this.invalidLogin = true;
      }

    )
}

}
