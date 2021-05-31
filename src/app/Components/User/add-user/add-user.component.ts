import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Role } from 'src/app/Models/role';
import { User } from 'src/app/Models/user';
import { RoleService } from 'src/app/Services/role.service';
import { UserService } from 'src/app/Services/user.service';
import { Villes } from 'src/app/Villes.types';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  roles;
  public nomrole : any;
  UserForm : FormGroup
  fieldTextType: boolean;

    constructor(private userservice : UserService ,
                private router : Router ,
                private rolesservice : RoleService,
                private toastr : ToastrService){

    } 

    ngOnInit(): void {
      this.rolesservice.getRoles().subscribe(
        (response : Role[]) => {
          this.roles = response.map(role => role.nomrole)
        }
      )
      
      this.UserForm = new FormGroup({
        nom : new FormControl('' , Validators.required),
        prenom : new FormControl('' , Validators.required),
        email : new FormControl('' , [Validators.required , Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        tel :  new FormControl(null , [Validators.required , Validators.pattern('[0-9]{8}')]),
        nomrole : new FormControl('' , Validators.required) 
      });
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

  // getter for better access to form fields
  get f() { return this.UserForm.controls; }


  
  public addUser() : void {
    console.log(this.roles);
    this.rolesservice.getRoleByNom(this.UserForm.get('nomrole').value).subscribe(
      (response) => {
        console.log(response.id);
        if (this.UserForm.valid) {
          let user = {
            ...this.UserForm.value,
            active : "active"
          }
          this.userservice.addUser(user , response.id).subscribe(
            (response : User) => {
              console.log(response);
              this.userservice.getUsers();
              this.router.navigate(['list-users'])
            }
          )
        }

        else {
          this.showError();
          return;
        }

      }
    )
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }


  showSuccess() {
    this.toastr.success('Client ajouté avec succée !');
    }

  showError() {
    this.toastr.error('remplissez tous les champs correctement !');
  }

}


