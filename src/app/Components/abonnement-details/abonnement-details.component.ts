import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Commentaire } from 'src/app/Models/commentaire';
import { ReclamationTT } from 'src/app/Models/reclamation';
import { Remarque } from 'src/app/Models/remarque';
import { Ticket } from 'src/app/Models/ticket';
import { AuthService } from 'src/app/Services/auth.service';
import { CommentaireService } from 'src/app/Services/commentaire.service';
import { ReclamationService } from 'src/app/Services/reclamation.service';
import { RemarqueService } from 'src/app/Services/remarque.service';
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

  closeResult = ''
  idAbonnement;
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject<any>();
  TicketToDisplay: Ticket;
  CommentForm : FormGroup;

  activeId = 1
  RemarqueForm: FormGroup;

  constructor(private ticketservice : TicketService,
              private router : Router,
              private route : ActivatedRoute,
              private modalService : NgbModal,
              private commentaireservice : CommentaireService,
              private authservice : AuthService,
              private remarqueservice : RemarqueService,
              private reclamationservice : ReclamationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.idAbonnement = params.get('id')
      } 
    );


    this.getTicketsByAbonnement();
    this.getRemarques();
    this.getReclamations();

    this.CommentForm = new FormGroup({
      text : new FormControl('' , Validators.required),
    });

    this.RemarqueForm = new FormGroup({
      text : new FormControl('' , Validators.required),
    });
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


  
  
  // Open Update Page

  openUpdateTicket(myObj) {
    this.router.navigate(['update-ticket/' + myObj['idTicket']])
  }

  openUpdateReclamation(myObj) {
    this.router.navigate(['update-rec/' + myObj['idReclamation']])
  }


}
