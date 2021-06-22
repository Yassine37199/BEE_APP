import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Abonnement } from 'src/app/Models/abonnement';
import { Remarque } from 'src/app/Models/remarque';
import { AbonnementsService } from 'src/app/Services/abonnements.service';

@Component({
  selector: 'app-list-abonnements',
  templateUrl: './list-abonnements.component.html',
  styleUrls: ['./list-abonnements.component.css']
})
export class ListAbonnementsComponent implements OnInit {

  dtOptions : DataTables.Settings = {
  };
  public abonnements : Abonnement[];
  closeResult = '';
  abonnementToDisplay : Abonnement;
  remarques : Remarque[];
  

  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private abonnementservice : AbonnementsService ,
              private router : Router,
              private modalService : NgbModal
              //private remarqueservice : RemarqueService
              ) { }

  ngOnInit(): void {
    this.getAbonnements();
    
  }

  public getAbonnements() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };

    this.abonnementservice.getAbonnements().subscribe(
      (response : Abonnement[]) => {
        console.log(response);
        this.abonnements = response;
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )

    /*this.remarqueservice.getRemarques().subscribe(
      (response : Remarque[]) => {
        this.remarques = response;
      }
    )*/
  }

  ngAfterViewInit(): void 
  {this.dtTrigger.next();}

  async ArchiverAbonnement(abonnement : Abonnement){
    await this.abonnementservice.updateAbonnement(abonnement.idAbonnement , abonnement.demandeAbonnement.idDemandeAbonnement,
      {...abonnement , active : !abonnement.active}).subscribe(
        (response) => {
          console.log(response);
          this.getAbonnements();
          this.router.navigate(['/list-abonnements'])
        }
      )
  }

 


  openUpdateAbonnement(myObj) {
    this.router.navigate(['update-abonnement/' + myObj['idAbonnement']])
  }

  openAddModem(myObj){
    this.router.navigate(['add-modem/' + myObj['idAbonnement']])
  }


  openListTickets(myObj) {
    this.router.navigate(['list-tickets/' + myObj['idAbonnement']])
  }


  open(content , abonnement : Abonnement) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.abonnementToDisplay = abonnement;
    //this.getRemarquesByAbonnement(this.abonnementToDisplay.idAbonnement);
    console.log(this.remarques);
  }

  openFormModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-form' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  /*public addRemarque(addForm : NgForm) : void {
    if(window.confirm("Ajouter cette demande ?")){
    this.remarqueservice.addRemarqueInAbonnement(addForm.value).subscribe(
      (response : Remarque) => {
        console.log(response);
        this.remarqueservice.getRemarques();
        this.router.navigate(['list-abonnements'])
      }
    )
  }
}*/

  /*public getRemarquesByAbonnement(idAbonnement : number){
    this.remarqueservice.getRemarquesByAbonnement(idAbonnement).subscribe(
      (response : Remarque[]) => this.remarques = response
    )
  }*/


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

}
