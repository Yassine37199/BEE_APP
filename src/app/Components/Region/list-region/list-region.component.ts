import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Region } from 'src/app/Models/region';
import { User } from 'src/app/Models/user';
import { RegionService } from 'src/app/Services/region.service';

@Component({
  selector: 'app-list-region',
  templateUrl: './list-region.component.html',
  styleUrls: ['./list-region.component.css']
})
export class ListRegionComponent implements OnInit {

  dtOptions : DataTables.Settings = {
    order : []
  };
  public regions : Region[];
  dtTrigger : Subject<any> = new Subject<any>();

  constructor(private regionservice : RegionService,
              private router : Router) { }

  ngOnInit(): void {
    this.getRegions();
    console.log(this.regions);
  }

 
  public getRegions() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };
    
    // Get Regions From Backend
    this.regionservice.getRegions().subscribe(
      (response : Region[]) => {
        console.log(response);
        this.regions = response;
        this.dtTrigger.next();
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  
  // Open Update Page
  openUpdateRegion(myObj) {
    this.router.navigate(['update-region/' + myObj['idRegion']])
  }

  
  
  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }


}
