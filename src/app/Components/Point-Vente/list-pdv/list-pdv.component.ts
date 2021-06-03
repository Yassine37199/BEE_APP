import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PointVente } from 'src/app/Models/point-vente';
import { PointVenteService } from 'src/app/Services/point-vente.service';

@Component({
  selector: 'app-list-pdv',
  templateUrl: './list-pdv.component.html',
  styleUrls: ['./list-pdv.component.css']
})
export class ListPdvComponent implements OnInit {

  dtOptions : DataTables.Settings = {};
  public points : PointVente[];
  

  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private pointventeservice : PointVenteService , private router : Router) { }

  ngOnInit(): void {
    this.getPoints();
  }

  public getPoints() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };

    this.pointventeservice.getPoints().subscribe(
      (response : PointVente[]) => {
        this.points = response;
        console.log(response);
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }




  openUpdatePoint(myObj : PointVente) {
    console.log(myObj);
    this.router.navigate(['update-pdv/' + myObj['idAgence']])
  }

  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }


}
