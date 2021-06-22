import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Offre } from 'src/app/Models/offre';
import { OffreService } from 'src/app/Services/offre.service';

@Component({
  selector: 'app-add-offre',
  templateUrl: './add-offre.component.html',
  styleUrls: ['./add-offre.component.css']
})
export class AddOffreComponent implements OnInit {

  constructor(private offreservice : OffreService ,
    private router : Router,
    private toastr : ToastrService,
    private _location : Location) { }

OffreForm : FormGroup;



ngOnInit(): void {
  this.OffreForm = new FormGroup({
    labelle : new FormControl('' , Validators.required),
    debit : new FormControl('' , Validators.required)
  })
}

// getter for better access to form fields
get f() { return this.OffreForm.controls; }


// Add Role
public addOffre() {
  if (this.OffreForm.valid) {
  this.offreservice.addOffre({...this.OffreForm.value , active : true}).subscribe(
  (response : Offre) => {
  console.log(response);
  this.offreservice.getOffres();
  this.router.navigate(['list-offres'])
  this.showSuccess();
}
)
}
else {
this.showError();
return;
}
}

goBack(){
  this._location.back()
}

showSuccess() {
this.toastr.success('Offre ajouté avec succée !');
}

showError() {
this.toastr.error('Remplir tous les champs correctement !');
}


}
