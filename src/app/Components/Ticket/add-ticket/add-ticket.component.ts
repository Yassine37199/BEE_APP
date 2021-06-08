import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, ObjectUnsubscribedError, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Ticket } from 'src/app/Models/ticket';
import { AuthService } from 'src/app/Services/auth.service';
import { TicketService } from 'src/app/Services/ticket.service';
import { Sujets } from 'src/app/Sujets.types';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {

  TicketForm : FormGroup;
  Severite = ['faible' , 'moyenne' , 'severe']
  idAbonnement;

  constructor(private ticketservice : TicketService ,
              private router : Router,
              private toastr : ToastrService,
              private authservice : AuthService,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.idAbonnement = params.get('id')
      } 
    );


    this.TicketForm = new FormGroup({
      sujet : new FormControl(null , [Validators.required]),
      type : new FormControl('' , [Validators.required]),
      severite : new FormControl('' , Validators.required),
    })
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
      map(term => (term === '' ? Sujets[this.TicketForm.get('type').value]
        : Sujets[this.TicketForm.get('type').value].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
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

  // getter for better access to form fields
  get f() { return this.TicketForm.controls; }

  
  // Add Client
  public addTicket() {
    if (this.TicketForm.valid) {
      let ticket : Ticket = {
        ...this.TicketForm.value,
        statut : "créée",
        statutN2 : "non escaladée",
        agentN2 : null,
        agentResolution : null,
      }

      this.ticketservice.addTicket(this.TicketForm.value , this.idAbonnement , this.authservice.getCurrentUser().idUser).subscribe(
        (response : Ticket) => {
          console.log(response);
          this.ticketservice.getTicketsByAbonnement(this.idAbonnement);
          this.router.navigate(['abonnement-details/' + this.idAbonnement])
          this.showSuccess();
        }
      )
    }
    else {
      this.showError();
      return;
    }
  }

  showSuccess() {
    this.toastr.success('Ticket ajouté avec succée !');
    }

  showError() {
    this.toastr.error('remplissez tous les champs correctement !');
  }

}
