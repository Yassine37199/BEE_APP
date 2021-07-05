import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Languages } from 'src/app/Languages';
import { Abonnement } from 'src/app/Models/abonnement';
import { Commentaire } from 'src/app/Models/commentaire';
import { Email } from 'src/app/Models/Email';
import { ReclamationTT } from 'src/app/Models/reclamation';
import { Region } from 'src/app/Models/region';
import { Remarque } from 'src/app/Models/remarque';
import { Ticket } from 'src/app/Models/ticket';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { AuthService } from 'src/app/Services/auth.service';
import { CommentaireService } from 'src/app/Services/commentaire.service';
import { EmailService } from 'src/app/Services/email.service';
import { ReclamationService } from 'src/app/Services/reclamation.service';
import { RegionService } from 'src/app/Services/region.service';
import { RemarqueService } from 'src/app/Services/remarque.service';
import { SmsService } from 'src/app/Services/sms.service';
import { TicketService } from 'src/app/Services/ticket.service';

@Component({
  selector: 'app-abonnement-details',
  templateUrl: './abonnement-details.component.html',
  styleUrls: ['./abonnement-details.component.css']
})
export class AbonnementDetailsComponent implements OnInit {

  tickets : Ticket[];
  remarques : Remarque[];
  commentaires : Commentaire[];
  reclamations : ReclamationTT[];

  abonnementToDisplay : Abonnement;

  closeResult = ''
  idAbonnement;
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject<any>();
  TicketToDisplay: Ticket;
  CommentForm : FormGroup;


  activeId = 1
  RemarqueForm: FormGroup;
  reclamationEmail: any;
  role: any;

  constructor(private ticketservice : TicketService,
              private router : Router,
              private route : ActivatedRoute,
              private modalService : NgbModal,
              private commentaireservice : CommentaireService,
              private authservice : AuthService,
              private remarqueservice : RemarqueService,
              private reclamationservice : ReclamationService,
              private regionservice : RegionService,
              private emailservice : EmailService,
              private toastrservice : ToastrService,
              private smsservice : SmsService,
              private abonnementservice : AbonnementsService,
              private _location : Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.idAbonnement = params.get('id')
      } 
    );
    
    this.abonnementservice.getAbonnement(this.idAbonnement).subscribe(
      (response) => this.abonnementToDisplay = response
    )

    this.getTicketsByAbonnement();
    this.getRemarques();
    this.getReclamations();

    this.CommentForm = new FormGroup({
      text : new FormControl('' , Validators.required),
    });

    this.RemarqueForm = new FormGroup({
      text : new FormControl('' , Validators.required),
    });

    this.role = this.authservice.getCurrentUser().role.nomrole;
  }
  
// Get Reclamations From Backend

public getReclamations() {
  this.reclamationservice.getReclamationByAbonnement(this.idAbonnement).subscribe(
    (response : ReclamationTT[]) => {
      this.reclamations = response
      console.log(response)
    }
  )
}



// Get Remarques From Backend

  public getRemarques() {
    this.remarqueservice.getRemarqueByAbonnement(this.idAbonnement).subscribe(
      (response : Remarque[]) => {
        this.remarques = response
        console.log(response)
      }
    )
  }


// Get Tickets From Backend

  public getTicketsByAbonnement() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language : Languages

    };
    
    // Get Tickets From Backend
    this.ticketservice.getTicketsByAbonnement(this.idAbonnement).subscribe(
      (response : Ticket[]) => {
        this.tickets = response;
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  
  // Get Commentaires From Backend
  public getCommentByTicket(idTicket : number){
    this.commentaireservice.getCommentByTicket(idTicket).subscribe(
      (response : Commentaire[]) => this.commentaires = response
    )
  }

  goBack(){
    this._location.back()
  }
  
  // Ouvrir Liste des commentaires
  open(contentComments , ticket : Ticket) {
    this.modalService.open(contentComments, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.TicketToDisplay = ticket;
    this.getCommentByTicket(this.TicketToDisplay.idTicket);
    console.log(this.commentaires);
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
  
  // Ouvrir Formulaire d'ajout commentaire

  openFormModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-form' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


// Ouvrir Formulaire d'ajout remarque

  openRemarqueModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-form' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
        this.ticketservice.updateTicket(
          this.TicketToDisplay.idTicket , 
          {...this.TicketToDisplay , statut : 'en cours'} ,
           this.TicketToDisplay.abonnement.idAbonnement).subscribe(
             (response) => {
               console.log(response)
             }
           )
        this.commentaireservice.getCommentByTicket(this.TicketToDisplay.idTicket);
      }
    )
  }
}


 // Ajouter une remarque

 public addRemarque() : void {
  if(this.RemarqueForm.valid){
  this.remarqueservice.addRemarqueForAbonnement(
    {...this.RemarqueForm.value},
     this.authservice.getCurrentUser().idUser,
    this.idAbonnement
    ).subscribe(
    (response : Remarque) => {
      console.log(response);
      this.remarqueservice.getRemarqueByAbonnement(this.idAbonnement);
    }
  )
}
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
        this.getTicketsByAbonnement();
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
      this.getTicketsByAbonnement(); 
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
       this.emailservice.SendMail(mail).subscribe(
         (response : Email) => {
          console.log(response)
          this.showSuccess();
         }
       )
       
    }

  )
  
  
}

showSuccess() {
  this.toastrservice.success('Email envoyé avec succée');
  }

showError() {
  this.toastrservice.error('remplissez tous les champs correctement !');
}

  
  
  // Open Update Page

  openUpdateTicket(myObj) {
    this.router.navigate(['update-ticket/' + myObj['idTicket']])
  }

  openUpdateReclamation(myObj) {
    this.router.navigate(['update-rec/' + myObj['idReclamation']])
  }


}
