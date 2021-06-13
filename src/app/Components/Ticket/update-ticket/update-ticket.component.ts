import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Ticket } from 'src/app/Models/ticket';
import { AuthService } from 'src/app/Services/auth.service';
import { CommentaireService } from 'src/app/Services/commentaire.service';
import { TicketService } from 'src/app/Services/ticket.service';
import { Sujets } from 'src/app/Sujets.types';

@Component({
  selector: 'app-update-ticket',
  templateUrl: './update-ticket.component.html',
  styleUrls: ['./update-ticket.component.css']
})
export class UpdateTicketComponent implements OnInit {

  public id;
  public TicketToUpdate : Ticket;
  type;
  severite;
  sujet;
  Severite = ['faible' , 'moyenne' , 'severe']

  constructor(private ticketservice : TicketService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService,
              private authservice : AuthService,
              private commentservice : CommentaireService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.ticketservice.getTicket(this.id).subscribe(
      response => {
        this.TicketToUpdate = response;
        console.log(this.TicketToUpdate);
        this.type = response.type;
        this.severite = response.severite;
        this.sujet = response.sujet;
      }
    )
  }

  @ViewChild('instanceSujet', {static: true}) instanceSujet: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  @ViewChild('instanceType', {static: true}) instanceType: NgbTypeahead;
  focusType$ = new Subject<string>();
  clickType$ = new Subject<string>();

  @ViewChild('instanceSeverite', {static: true}) instanceSeverite: NgbTypeahead;
  focusSeverite$ = new Subject<string>();
  clickSeverite$ = new Subject<string>();
  

  
  
  searchSujet: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instanceSujet.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Sujets[this.type]
        : Sujets[this.type].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  searchSeverite: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickSeverite$.pipe(filter(() => !this.instanceSeverite.isPopupOpen()));
    const inputFocus$ = this.focusSeverite$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.Severite
        : this.Severite.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  
  searchType: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickType$.pipe(filter(() => !this.instanceType.isPopupOpen()));
    const inputFocus$ = this.focusType$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Object.keys(Sujets)
        : Object.keys(Sujets).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


public onUpdateTicket(ticket : Ticket) : void {
  if(window.confirm("Modifier cet Ticket ?")){
      this.ticketservice.updateTicket(this.id ,
        {...this.TicketToUpdate,
          sujet : this.sujet,
          severite : this.severite,
          type : this.type
      }, this.TicketToUpdate.abonnement.idAbonnement).subscribe(
        (response : Ticket) => {
          this.commentservice.addComment({
            text : `Ticket modifiée par ${this.authservice.getCurrentUser().nom} au ${new Date()}`},
            response.idTicket,
            this.authservice.getCurrentUser().idUser
          ).subscribe(
            (responseComment) => console.log("Commentaire créee")
          )
          this.ticketservice.getTicketsByAbonnement(this.TicketToUpdate.abonnement.idAbonnement);
          this.router.navigate(['abonnement-details/' + this.TicketToUpdate.abonnement.idAbonnement]);
          this.showSuccess();
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }
  }

  showSuccess() {
    this.toastr.success('Role modifié avec succée !');
    }

}
