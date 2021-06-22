import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/Models/role';
import { RoleService } from 'src/app/Services/role.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

  constructor(private roleservice : RoleService ,
              private router : Router,
              private toastr : ToastrService,
              private _location : Location) { }

  RoleForm : FormGroup;

  

  ngOnInit(): void {
    this.RoleForm = new FormGroup({
      nomrole : new FormControl('' , Validators.required)
    })
  }
  
  // getter for better access to form fields
  get f() { return this.RoleForm.controls; }

  
  // Add Role
  public addRole() {
    if (this.RoleForm.valid) {
      this.roleservice.addRole(this.RoleForm.value).subscribe(
        (response : Role) => {
          console.log(response);
          this.roleservice.getRoles();
          this.router.navigate(['list-roles'])
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
    this.toastr.success('Role ajouté avec succée !');
    }

  showError() {
    this.toastr.error('Remplir tous les champs correctement !');
  }


}
