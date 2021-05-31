import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authservice : AuthService,
              private router : Router) { }

  ngOnInit(): void {
    this.authservice.logout();
    this.router.navigate(['login']);
  }

}
