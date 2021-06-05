import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/Models/ticket';
import { AuthService } from 'src/app/Services/auth.service';
import { TicketService } from 'src/app/Services/ticket.service';

@Component({
  selector: 'app-stats-cards',
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
 
  tickets : Ticket[];
  countTickets = 0;
  countTicketsResolu = 0;

  constructor(private ticketservice : TicketService , private authservice : AuthService) { }

  ngOnInit(): void {

    this.getTicketsCount();
  }

  getTicketsCount(){
    this.ticketservice.getTicketsByUser(this.authservice.getCurrentUser().idUser).subscribe(
      response => {
        this.tickets = response
        console.log(this.tickets)
        this.countTickets = this.tickets.reduce((acc , ticket) => acc + 1 , 0);
        console.log(this.countTickets)
        this.countTicketsResolu = this.tickets.reduce((acc , ticket) => {
          if (ticket.dateResolution == null) return acc + 1
          else return acc
        }, 0)
        console.log(this.countTicketsResolu);
      }
    )
  }

  

}
