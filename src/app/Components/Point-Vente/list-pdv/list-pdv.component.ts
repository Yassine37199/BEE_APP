import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  pdvToShow: PointVente;
  closeResult = ""
  constructor(private pointventeservice : PointVenteService , private router : Router ,private modalService : NgbModal) { }

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
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  ngAfterViewInit(): void 
  {this.dtTrigger.next();}


  async ArchiverPoint(point : PointVente){
    await this.pointventeservice.updatePoint(point.idAgence,
      {...point , active : !point.active}).subscribe(
        (response) => {
          console.log(response);
          this.getPoints();
          this.router.navigate(['/list-pdv'])
        }
      )
  }

  showPDV(point : PointVente , content){
    this.pdvToShow = point
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }




  openUpdatePoint(myObj : PointVente) {
    console.log(myObj);
    this.router.navigate(['update-pdv/' + myObj['idAgence']])
  }

  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }


}
