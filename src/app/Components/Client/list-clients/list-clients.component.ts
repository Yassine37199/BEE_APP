import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Languages } from 'src/app/Languages';
import { Client } from 'src/app/Models/client';
import { ClientService } from 'src/app/Services/client.service';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit {

  clientToShow : Client
  closeResult = '';

  dtOptions : DataTables.Settings = {
    scrollX : true,
    scrollY : "100"
  };
  public clients : Client[];
  

  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private clientservice : ClientService , private router : Router, private modalService : NgbModal) { }

  ngOnInit(): void {
    this.getClients();
    console.log(this.clients);
  }

  public getClients() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language : Languages
    };

    this.clientservice.getClients().subscribe(
      (response : Client[]) => {
        this.clients = response;
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  ngAfterViewInit(): void 
  {this.dtTrigger.next();}


  openUpdateClient(myObj) {
    this.router.navigate(['update-client/' + myObj['idClient']])
  }

  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

  async ArchiverClient(client : Client){
    await this.clientservice.updateClient(client.idClient,
      {...client , active : !client.active}).subscribe(
        (response) => {
          console.log(response);
          this.getClients();
          this.router.navigate(['/list-clients'])
        }
      )
  }

  showClient(client : Client , content){
    this.clientToShow = client
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  

}
