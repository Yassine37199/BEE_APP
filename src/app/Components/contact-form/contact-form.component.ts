import { HttpErrorResponse } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgentTTService } from 'src/app/Services/agent-tt.service';
import { AuthService } from 'src/app/Services/auth.service';
import { EmailService } from 'src/app/Services/email.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  id;
  agentTT;
  NomAgentTT : string;
  EmailAgentTT : string;
  EmailN2;
  PasswordN2;
  Sujet;
  Message;

  constructor(private authservice : AuthService,
              private agentservice : AgentTTService,
              private route : ActivatedRoute,
              private emailservice : EmailService,
              private toastr : ToastrService,
              private router : Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        console.log(this.id);
      } 
    );

    this.agentservice.getAgentTT(this.id).subscribe(
      (response) => {
        this.agentTT = response
        this.NomAgentTT = response.name
        this.EmailAgentTT = response.email
      }
    )

    this.EmailN2 = this.authservice.getCurrentUser().email;
  }


  envoyerMail(){
    this.emailservice.SendMail({
      to : this.EmailAgentTT,
      from : this.EmailN2,
      fromPassword : this.PasswordN2,
      subject : this.Sujet,
      content : this.Message
    }).subscribe(
      (response) => {
        console.log(response)
        this.showSuccess()
      }
    ),(error : HttpErrorResponse) => {
      this.showError()
    }
  }

  showSuccess() {
    this.toastr.success('Email Envoyée avec succée !');
    }
    
    showError() {
    this.toastr.error('Remplir tous les champs correctement !');
    }

}
