import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Languages } from 'src/app/Languages';
import { User } from 'src/app/Models/user';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  dtOptions : DataTables.Settings = {
    order : []
  };
  public users : User[];
  dtTrigger : Subject<any> = new Subject<any>();

  constructor(private userservice : UserService,
              private router : Router) { }

  ngOnInit(): void {
    this.getUsers();
    console.log(this.users);
  }

  ngAfterViewInit(): void 
  {this.dtTrigger.next();}

  public getUsers() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language : Languages
    };
    
    // Get Users From Backend
    this.userservice.getUsers().subscribe(
      (response : User[]) => {
        console.log(response);
        this.users = response;
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  
  // Open Update Page
  openUpdateUser(myObj) {
    this.router.navigate(['update-user/' + myObj['idUser']])
  }

  // Disable user
  async disableUser(user : User){
    if(user.active === "inactive") {
    await this.userservice.updateUser({...user , active : "active"} , user.idUser , user.role.id).subscribe(
      (response) => {
        console.log(response);
        this.getUsers();
        this.router.navigate(['/list-users']);}
    )}
    else await this.userservice.updateUser({...user , active : "inactive"} , user.idUser , user.role.id).subscribe(
      (response) => {
        console.log(response);
        this.getUsers();
        this.router.navigate(['/list-users']);}
    )}
  
  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

}
