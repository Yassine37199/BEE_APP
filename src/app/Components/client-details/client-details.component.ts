import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Abonnement } from 'src/app/Models/abonnement';
import { Ticket } from 'src/app/Models/ticket';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { TicketService } from 'src/app/Services/ticket.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  critere;
  searchValue;
  tickets : Ticket[];
  closeResult = '';

  dtOptions : DataTables.Settings = {};
  public abonnements : Abonnement[];
  dtTrigger : Subject<any> = new Subject<any>();

  constructor(private abonnementservice : AbonnementsService,
              private router : Router,
              private route : ActivatedRoute,
              private modalService : NgbModal,
              private ticketservice : TicketService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.critere = params.get('critere');
        this.searchValue = params.get('search');
      } 
    );


    switch(this.critere) {
      case 'CIN Client' : this.getAbonnementByCIN(this.searchValue);break;
      default : alert(this.critere)
    }
  }


  public getAbonnementByCIN(cin : number) : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };
    
    // Get Users From Backend
    this.abonnementservice.getAbonnementsByCIN(cin).subscribe(
      (response : Abonnement[]) => {
        this.abonnements = response;
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  
  // Open Update Page
  openUpdateAbonnement(myObj) {
    this.router.navigate(['update-abonnement/' + myObj['idAbonnement']])
  }

  // Open Details Page
  
  openDetailsAbonnement(myObj) {
    this.router.navigate(['abonnement-details/' + myObj['idAbonnement']])
  }
  
  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

}
