import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AgentTT } from 'src/app/Models/agentTT';
import { AgentTTService } from 'src/app/Services/agent-tt.service';

@Component({
  selector: 'app-list-agents-tt',
  templateUrl: './list-agents-tt.component.html',
  styleUrls: ['./list-agents-tt.component.css']
})
export class ListAgentsTTComponent implements OnInit {

  dtOptions : DataTables.Settings = {};
  public agentsTT : AgentTT[];
  

  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private agentservice : AgentTTService , private router : Router) { }

  ngOnInit(): void {
    this.getAgents();
  }

  public getAgents() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };

    this.agentservice.getAgentsTT().subscribe(
      (response : AgentTT[]) => {
        this.agentsTT = response;
        console.log(response);
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }




  openUpdateAgentTT(myObj : AgentTT) {
    console.log(myObj);
    this.router.navigate(['update-agentTT/' + myObj['idAgentTT']])
  }

  openContactAgentTT(myObj : AgentTT){
    this.router.navigate(['contact/' + myObj['idAgentTT']])
  }

  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

}
