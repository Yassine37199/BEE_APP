import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Role } from 'src/app/Models/role';
import { User } from 'src/app/Models/user';
import { RoleService } from 'src/app/Services/role.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  public id;
  public UserToUpdate : User;
  roles;
  nomrole : string;
  fieldTextType: boolean;

  constructor(private userservice : UserService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService,
              private roleservice : RoleService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.roleservice.getRoles().subscribe(
      (response : Role[]) => {
        this.roles = response.map(role => role.nomrole)
      }
    )

    this.userservice.getUser(this.id).subscribe(
      response => {
        this.UserToUpdate = response;
        this.nomrole = this.UserToUpdate.role.nomrole
      }
    )
  }


  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  
  
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.roles
        : this.roles.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


public onUpdateUser(userUpdate : User) : void {
  console.log(this.roles);
  this.roleservice.getRoleByNom(this.nomrole).subscribe(
    (response) => {
      console.log(response.id);
      if (window.confirm("Modifier cet utilisateur ?")) {
        let user = {
          idUser : this.id,
          ...userUpdate,
          active : "active"
        }
      this.userservice.updateUser(user , this.id , response.id).subscribe(
        (response : User) => {
          this.userservice.getUsers();
          this.router.navigate(['list-users']);
          this.showSuccess();
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }
  })
}

toggleFieldTextType() {
  this.fieldTextType = !this.fieldTextType;
}

  showSuccess() {
    this.toastr.success('Utilisateur modifié avec succée !');
    }


}
