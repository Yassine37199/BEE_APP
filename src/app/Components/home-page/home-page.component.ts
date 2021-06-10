import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Email } from 'src/app/Models/Email';
import { Region } from 'src/app/Models/region';
import { Ticket } from 'src/app/Models/ticket';
import { RolesType } from 'src/app/Roles.types';
import { AuthService } from 'src/app/Services/auth.service';
import { EmailService } from 'src/app/Services/email.service';
import { RegionService } from 'src/app/Services/region.service';
import { TicketService } from 'src/app/Services/ticket.service';
import * as moment from "moment"
import { CommentaireService } from 'src/app/Services/commentaire.service';
import { Commentaire } from 'src/app/Models/commentaire';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  dtOptions : DataTables.Settings = {};
  mesTickets : Ticket[];
  closeResult = '';
  TicketToDisplay : Ticket;
  idUser : number;
  critere : string;
  searchValue : string;
  commentaires : Commentaire[];
  

  dtTrigger : Subject<any> = new Subject<any>();
  CommentForm: any;
  constructor(private ticketservice : TicketService , 
              private router : Router,
              private authservice : AuthService,
              private regionservice : RegionService,
              private modalService : NgbModal,
              private emailService : EmailService,
              private toastrservice : ToastrService,
              private commentaireservice : CommentaireService) { }

  ngOnInit(): void {
    if(this.authservice.getCurrentUser().role.nomrole !== RolesType.AGENT_SUPPORT_TECHNIQUE_N2){
      this.getMesTickets();
    }
    else {
      this.getMesTicketsEscalade();

    }

    this.CommentForm = new FormGroup({
      text : new FormControl('' , Validators.required),
    });
  }
  
  
  public getMesTickets() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };
    
    
    
    
    this.ticketservice.getTicketsByUser(this.authservice.getCurrentUser().idUser).subscribe(
      (response : Ticket[]) => {
        this.mesTickets = response;
        this.verifEscalade();
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  // Show Listes Governorats in Select input
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? ['Adresse Mac' , 'CIN Client' , 'Reférence TT']
        : ['Adresse Mac' , 'CIN Client' , 'Reférence TT'].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

    

 


  public getMesTicketsEscalade() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };
    
    
    let nomAgent : string = `${this.authservice.getCurrentUser().nom} ${this.authservice.getCurrentUser().prenom}`
    this.ticketservice.getTicketsByUserN2(nomAgent).subscribe(
      (response : Ticket[]) => {
        this.mesTickets = response;
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  // TODO : Escalade Automatique des Tickets
  escaladeAuto(ticket : Ticket) {
  }
  

  searchAbonnement(){
    this.router.navigate(['client-details/' + this.critere + '/' + this.searchValue ])
  }


  showTicket(ticket : Ticket) {
    console.log(ticket);
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
      this.ticketservice.updateTicket(ticket.idTicket , ticket).subscribe(
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
    this.ticketservice.updateTicket(ticket.idTicket , ticket).subscribe(
      response => {
        console.log(response);
        this.getMesTickets();
      }
    )

  }


  sendMailN2(ticket : Ticket , addForm : NgForm){
    this.regionservice.findRegionByName(ticket.abonnement.demandeAbonnement.gouvernorat).subscribe(
      (response : Region) => {
        let mail : Email = {
          fromPassword : "chronoyass284125077319",
          from : this.authservice.getCurrentUser().email,
          to : response.agentTT.email,
          content : `Probléme de ${ticket.sujet} pour le client de Reférence TT : ${ticket.abonnement.refTT}`,
          subject : `Mail de Réclamation de l'agent N2 ${response.user.nom} pour Mr/Mme ${response.agentTT.name}`      
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

  verifEscalade(){
    this.mesTickets.map((ticket) => {
      if(Math.abs(moment(new Date()).diff(moment(ticket.dateEscalade) , 'days')) == 0 && ticket.statutN2 == "non escaladée" )
      this.escaladerTicket(ticket);
    })
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
