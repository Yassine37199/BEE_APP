import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DemandeAbonnement } from 'src/app/Models/demande-abonnement';
import { Remarque } from 'src/app/Models/remarque';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { DemandeAbonnementService } from 'src/app/Services/demande-abonnement.service';

@Component({
  selector: 'app-list-demandes',
  templateUrl: './list-demandes.component.html',
  styleUrls: ['./list-demandes.component.css']
})
export class ListDemandesComponent implements OnInit {

  dtOptions : DataTables.Settings = {
  };
  public demandes  : DemandeAbonnement[];
  closeResult = '';
  demandeToDisplay : DemandeAbonnement;
  remarques : Remarque[];
  

  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private demandeservice : DemandeAbonnementService ,
              private router : Router,
              private modalService : NgbModal
              //private remarqueservice : RemarqueService
              ) { }

  ngOnInit(): void {
    this.getDemandes();
    
  }

  public getDemandes() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };

    this.demandeservice.getDemandes().subscribe(
      (response : DemandeAbonnement[]) => {
        console.log(response);
        this.demandes = response;
        this.dtTrigger.next()
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

 


  openUpdateDemandes(myObj : DemandeAbonnement) {
    this.router.navigate(['update-demandes/' + myObj['idDemandeAbonnement']])
  }

  openAjoutAbonnement(myObj : DemandeAbonnement) {
    this.router.navigate(['add-abonnement/' + myObj['idDemandeAbonnement']])
  }


  open(content , demande : DemandeAbonnement) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.demandeToDisplay = demande;
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