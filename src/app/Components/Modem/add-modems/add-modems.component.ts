import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Modem } from 'src/app/Models/modem';
import { Role } from 'src/app/Models/role';
import { ModemService } from 'src/app/Services/modem.service';

@Component({
  selector: 'app-add-modems',
  templateUrl: './add-modems.component.html',
  styleUrls: ['./add-modems.component.css']
})
export class AddModemsComponent implements OnInit {

  constructor(private modemservice : ModemService ,
    private router : Router,
    private toastr : ToastrService) { }

  ModemForm : FormGroup;



ngOnInit(): void {
  this.ModemForm = new FormGroup({
    modemSN :  new FormControl('' , Validators.required),
    loginConfig :  new FormControl('' , Validators.required),
    mdpConfig :  new FormControl('' , Validators.required)
  })
}

// getter for better access to form fields
get f() { return this.ModemForm.controls; }


// Add Role
public addModem() {
  if (this.ModemForm.valid) {
  this.modemservice.addModem(this.ModemForm.value).subscribe(
  (response : Modem) => {
  console.log(response);
  this.modemservice.getModems();
  this.router.navigate(['list-mdms'])
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
this.toastr.success('Modem ajouté avec succée !');
}

showError() {
this.toastr.error('Remplir tous les champs correctement !');
}


}
