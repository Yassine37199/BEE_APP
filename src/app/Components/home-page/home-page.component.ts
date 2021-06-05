import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Region } from 'src/app/Models/region';
import { Ticket } from 'src/app/Models/ticket';
import { AuthService } from 'src/app/Services/auth.service';
import { RegionService } from 'src/app/Services/region.service';
import { TicketService } from 'src/app/Services/ticket.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  dtOptions : DataTables.Settings = {};
  mesTickets : Ticket[];
  idUser : number;
  

  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private ticketservice : TicketService , 
              private router : Router,
              private authservice : AuthService,
              private regionservice : RegionService) { }

  ngOnInit(): void {
    this.getMesTickets();
    console.log(this.authservice.getCurrentUser().idUser);
  }
 
  public getMesTickets() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };
    
    
    
    this.ticketservice.getTicketsByUser(this.authservice.getCurrentUser().idUser).subscribe(
      (response : Ticket[]) => {
        this.mesTickets = response;
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
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
        statutN2 : "escaladée",
        agentN2 : `${response.user.nom} ${response.user.prenom}`
      }
      this.ticketservice.updateTicket(ticket.idTicket , ticket).subscribe(
        response => {
          console.log(response);
          this.getMesTickets();
        }
      )
      console.log(`email envoyé vers ${response.user.email}`)
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

  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

  


}
