import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgentTT } from 'src/app/Models/agentTT';
import { AgentTTService } from 'src/app/Services/agent-tt.service';

@Component({
  selector: 'app-add-agent-tt',
  templateUrl: './add-agent-tt.component.html',
  styleUrls: ['./add-agent-tt.component.css']
})
export class AddAgentTTComponent implements OnInit {

  constructor(private agentservice : AgentTTService ,
    private router : Router,
    private toastr : ToastrService) { }

AgentForm : FormGroup;



ngOnInit(): void {
  this.AgentForm = new FormGroup({
    name : new FormControl('' , Validators.required),
    email : new FormControl('' , [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  })
}

// getter for better access to form fields
get f() { return this.AgentForm.controls; }


// Add Role
public addAgentTT() {
  if (this.AgentForm.valid) {
  this.agentservice.addAgentTT({...this.AgentForm.value}).subscribe(
  (response : AgentTT) => {
  console.log(response);
  this.agentservice.getAgentsTT();
  this.router.navigate(['list-agents'])
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
this.toastr.success('Offre ajouté avec succée !');
}

showError() {
this.toastr.error('Remplir tous les champs correctement !');
}

}
