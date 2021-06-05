import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';

/*function sidebar() {
  let btn = document.querySelector("#btn");
  let sidebar = document.querySelector(".sidebar");
  let searchBtn = document.querySelector(".bx-search");

  btn.addEventListener("click" , function () {
    sidebar.classList.toggle("active");
    if(btn.classList.contains("bx-menu")){
      btn.classList.replace("bx-menu" , "bx-menu-alt-right");
    }else{
      btn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
  }) 
  searchBtn.addEventListener("click" , function() {
    sidebar.classList.toggle("active");
  }) 
}*/

function togglenav(){
  let btn = document.querySelector("#btn");
  let sidebar = document.querySelector(".sidebar");

  sidebar.classList.toggle("active");
    if(btn.classList.contains("bx-menu")){
      btn.classList.replace("bx-menu" , "bx-menu-alt-right");
    }else{
      btn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   $: any;
   user = JSON.parse(sessionStorage.getItem('user'));
   constructor(public authservice : AuthService){}


  ngOnInit(): void {
       
  }

ToggleSidebar(){
    togglenav();
  }



  title = 'Test-Design';
}
