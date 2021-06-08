import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Email } from 'src/app/Models/Email';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Services/auth.service';
import { EmailService } from 'src/app/Services/email.service';
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
  adminUser : User;
  from : string;
  fromPassword:string;

  successMessage = "Authentication success";
  errorMessage = "Invalide username or password";

  constructor(private router : Router,
    private loginservice : AuthService,
    private userservice : UserService,
    private modalService : NgbModal,
    private emailservice : EmailService) { }

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

open(content) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

   sendPasswordDemand(){
     this.userservice.getUsersAdmin().subscribe(
      (response) => {
        this.adminUser = response[0];
        let mail : Email = {
          from : this.from,
          fromPassword : this.fromPassword,
          to : response[0].email,
          content : `Madame, Monsieur, Je ne parviens plus à me connecter au plateforme en raison de la perte du mot de passe associé à mon compte. Je vous serais reconnaissant(e) de bien vouloir m'envoyer un nouveau mot de passe`,
          subject : "Demande de Changement de Mot de Passe"
        }
        console.log(mail);
        this.emailservice.SendMail(mail).subscribe(
          (response) => console.log(response) 
        )
      }
    )
  }


}
