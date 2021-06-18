import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Client } from 'src/app/Models/client';
import { ClientService } from 'src/app/Services/client.service';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit {

  dtOptions : DataTables.Settings = {};
  public clients : Client[];
  

  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private clientservice : ClientService , private router : Router) { }

  ngOnInit(): void {
    this.getClients();
    console.log(this.clients);
  }

  public getClients() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };

    this.clientservice.getClients().subscribe(
      (response : Client[]) => {
        this.clients = response;
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }


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

  

}
