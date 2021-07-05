import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Languages } from 'src/app/Languages';
import { Commentaire } from 'src/app/Models/commentaire';
import { Email } from 'src/app/Models/Email';
import { ReclamationTT } from 'src/app/Models/reclamation';
import { Region } from 'src/app/Models/region';
import { Ticket } from 'src/app/Models/ticket';
import { AuthService } from 'src/app/Services/auth.service';
import { CommentaireService } from 'src/app/Services/commentaire.service';
import { DemandeAbonnementService } from 'src/app/Services/demande-abonnement.service';
import { EmailService } from 'src/app/Services/email.service';
import { ReclamationService } from 'src/app/Services/reclamation.service';
import { RegionService } from 'src/app/Services/region.service';
import { SmsService } from 'src/app/Services/sms.service';
import { TicketService } from 'src/app/Services/ticket.service';

@Component({
  selector: 'app-mes-tickets',
  templateUrl: './mes-tickets.component.html',
  styleUrls: ['./mes-tickets.component.css']
})
export class MesTicketsComponent implements OnInit {

  dtOptions : DataTables.Settings = {
   
     
  };
  mesTickets : Ticket[];
  TicketToDisplay : Ticket;
  idUser : number;
  commentaires : Commentaire[];
  reclamationEmail : ReclamationTT;
  role;

  dtTrigger : Subject<any> = new Subject<any>();
  CommentForm: any;
  closeResult: string;
  constructor(private ticketservice : TicketService , 
              private router : Router,
              public authservice : AuthService,
              private regionservice : RegionService,
              private modalService : NgbModal,
              private emailService : EmailService,
              private toastrservice : ToastrService,
              private commentaireservice : CommentaireService,
              private demandeservice : DemandeAbonnementService,
              private reclamationservice : ReclamationService,
              private smsservice : SmsService) { }

  ngOnInit(): void {
    this.getMesTickets();
  }

  public getMesTickets() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language : Languages

    };
    
    
    
    
    this.ticketservice.getTicketsByUser(this.authservice.getCurrentUser().idUser).subscribe(
      (response : Ticket[]) => {
        this.mesTickets = response;
        
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )

    this.CommentForm = new FormGroup({
      text : new FormControl('' , Validators.required),
    });
    
    this.role = this.authservice.getCurrentUser().role.nomrole;
  }

  ngAfterViewInit(): void 
  {this.dtTrigger.next();}

  open(content , ticket : Ticket) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.TicketToDisplay = ticket;
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

  // Ajouter un commentaire

  public addCommentaire() : void {
    if(this.CommentForm.valid){
    this.commentaireservice.addComment(
      {...this.CommentForm.value},
      this.TicketToDisplay.idTicket,
      this.authservice.getCurrentUser().idUser
      ).subscribe(
      (response : Commentaire) => {
        console.log(response);
        this.commentaireservice.getCommentByTicket(this.TicketToDisplay.idTicket);
      }
    )
  }
}

  // Ouvrir Formulaire d'ajout commentaire

  openFormModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-form' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openUpdateTicket(myObj) {
    this.router.navigate(['update-ticket/' + myObj['idTicket']])
  }

  escaladerTicket(ticket : Ticket){
    console.log(ticket.abonnement.demandeAbonnement.gouvernorat);
    this.regionservice.findRegionByName(ticket.abonnement.demandeAbonnement.gouvernorat).subscribe(
      (response) => {
      ticket = {
        ...ticket,
        dateCreation : ticket.dateCreation,
        statutN2 : "escaladée",
        agentN2 : `${response.user.nom} ${response.user.prenom}`
      }
      this.ticketservice.updateTicket(ticket.idTicket , ticket , ticket.abonnement.idAbonnement).subscribe(
        response => {
          console.log(response);
          this.getMesTickets();
        }
      )
    }
  )
}

  public resolutionTicket(ticket : Ticket){
    ticket = {
      ...ticket,
      statut : "résolu",
      dateResolution : new Date(),
      agentResolution : `${this.authservice.getCurrentUser().nom} ${this.authservice.getCurrentUser().prenom}`
    }
    this.ticketservice.updateTicket(ticket.idTicket , ticket, ticket.abonnement.idAbonnement).subscribe(
      response => {
        this.smsservice.SendSMS({
          phoneNumber : `+216${response.abonnement.demandeAbonnement.client.telephone.toString()}`,
          message : `Cher Client, Votre problème a été résolu dans ${moment(new Date()).format("DD MM YYYY hh:mm:ss")}, Merci pour votre patience`
        }).subscribe(
          (response) => console.log(response)
        )
        this.getMesTickets(); 
      }
    )

  }


  async sendMailN2(ticket : Ticket , addForm : NgForm){
    await this.reclamationservice.getReclamationByAbonnement(ticket.abonnement.idAbonnement).subscribe(
      (response) => {
        console.log(response[0]);
        this.reclamationEmail = response[0]
      }
    )

    this.regionservice.findRegionByName(ticket.abonnement.demandeAbonnement.gouvernorat).subscribe(
      (response : Region) => {
        let mail : Email = {
          fromPassword : "chronoyass284125077319",
          from : this.authservice.getCurrentUser().email,
          to : response.responsableTT.email,
          content : `Probléme de ${this.reclamationEmail.objet} pour le client de telADSL : ${this.reclamationEmail.telADSL}`,
          subject : `Mail de Réclamation de l'agent N2 ${response.user.nom} pour Mr/Mme ${response.responsableTT.name}`      
         }
         console.log(mail);
         this.emailService.SendMail(mail).subscribe(
           (response : Email) => {
            console.log(response)
            this.showSuccess();
           }
         )
         
      }

    )
    
    
  }

  public getCommentByTicket(idTicket : number){
    this.commentaireservice.getCommentByTicket(idTicket).subscribe(
      (response : Commentaire[]) => this.commentaires = response
    )
  }

  openComments(contentComments , ticket : Ticket) {
    this.modalService.open(contentComments, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.TicketToDisplay = ticket;
    this.getCommentByTicket(this.TicketToDisplay.idTicket);
    console.log(this.commentaires);
  }

  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

  

  

  showSuccess() {
    this.toastrservice.success('Email envoyé avec succée');
    }

  showError() {
    this.toastrservice.error('remplissez tous les champs correctement !');
  }


}
