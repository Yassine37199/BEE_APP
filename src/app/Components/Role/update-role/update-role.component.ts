import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/Models/role';
import { RoleService } from 'src/app/Services/role.service';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent implements OnInit {

  public id;
  public RoleToUpdate : Role;

  constructor(private roleservice : RoleService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.roleservice.getRole(this.id).subscribe(
      response => {
        this.RoleToUpdate = response; ''
      }
    )
  }


public onUpdateRole(role : Role) : void {
  if(window.confirm("Modifier ce Role ?")){
      this.roleservice.updateRole(this.id , {...role , id : this.id}).subscribe(
        (response : Role) => {
          this.roleservice.getRoles();
          this.router.navigate(['list-roles']);
          this.showSuccess();
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }
  }

  showSuccess() {
    this.toastr.success('Role modifié avec succée !');
    }


}
