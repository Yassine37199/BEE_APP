import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentTT } from 'src/app/Models/agentTT';
import { AgentTTService } from 'src/app/Services/agent-tt.service';

@Component({
  selector: 'app-update-agent-tt',
  templateUrl: './update-agent-tt.component.html',
  styleUrls: ['./update-agent-tt.component.css']
})
export class UpdateAgentTTComponent implements OnInit {

  public id;
  public AgentToUpdate : AgentTT;

  constructor(private agentservice :  AgentTTService,
              private router : Router,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        console.log(this.id);
      } 
    );

    this.agentservice.getAgentTT(this.id).subscribe(
      response => {
        console.log(response);
        this.AgentToUpdate = response;
      }
    )
  }



public onUpdateAgent(agentUpdt : AgentTT) : void {
     if(window.confirm("Modifier ce agent  ?"))
      
      this.agentservice.updateAgentTT(this.id , agentUpdt).subscribe(
        (response : AgentTT) => {
          console.log(response);
          this.agentservice.getAgentsTT();
          this.router.navigate(['list-agents']);
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }

}
