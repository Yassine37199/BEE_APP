import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Languages } from 'src/app/Languages';
import { DemandeAbonnement } from 'src/app/Models/demande-abonnement';
import { Remarque } from 'src/app/Models/remarque';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { AuthService } from 'src/app/Services/auth.service';
import { DemandeAbonnementService } from 'src/app/Services/demande-abonnement.service';
import { RemarqueService } from 'src/app/Services/remarque.service';

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
  demandeToShow;
  

  dtTrigger : Subject<any> = new Subject<any>();
  RemarqueForm: any;
  constructor(private demandeservice : DemandeAbonnementService ,
              private router : Router,
              private modalService : NgbModal,
              private abonnementservice : AbonnementsService,
              private remarqueservice : RemarqueService,
              private authservice : AuthService
              ) { }

  ngOnInit(): void {
    this.getDemandes();

    this.abonnementservice.getAbonnementByDemande(60).subscribe(
      (response) => {
        if (response !== null) console.log(true);
        else console.log(false);
      }
    )

    this.abonnementservice.getAbonnementByDemande(60).subscribe(
      (response) => {
        console.log(response)
      }
    )

    this.RemarqueForm = new FormGroup({
      text : new FormControl('' , Validators.required),
    });
    
  }


// Get Reclamations From Backend
public getRemarques(idDemandeAbonnement : number) {
  this.remarqueservice.getRemarqueByDemande(idDemandeAbonnement).subscribe(
    (response : Remarque[]) => {
      this.remarques = response
      console.log(response)
    }
  )
}

  public getDemandes() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language : Languages
    }; 

    this.demandeservice.getDemandes().subscribe(
      (response : DemandeAbonnement[]) => {
        this.demandes = response; 
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  ngAfterViewInit(): void 
  {this.dtTrigger.next();}

  // Ajouter une remarque

 public addRemarque() : void {
  if(this.RemarqueForm.valid){
  this.remarqueservice.addRemarqueForDemande(
    {...this.RemarqueForm.value},
     this.authservice.getCurrentUser().idUser,
    this.demandeToDisplay.idDemandeAbonnement
    ).subscribe(
    (response : Remarque) => {
      console.log(response);
      this.remarqueservice.getRemarqueByDemande(this.demandeToDisplay.idDemandeAbonnement);
    }
  )
}
}

   

  openUpdateDemande(myObj : DemandeAbonnement) {
    this.router.navigate(['update-demande/' + myObj['idDemandeAbonnement']])
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
    this.getRemarques(this.demandeToDisplay.idDemandeAbonnement);
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

  showDemande(demande : DemandeAbonnement , content){
    this.demandeToShow = demande
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title' , size : 'lg' , centered : true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async ArchiverDemande(demande : DemandeAbonnement){
    await this.demandeservice.updateDemande(demande.idDemandeAbonnement , demande.client.idClient, demande.offre.idOffre,
     demande.agence.idAgence ,  {...demande , active : !demande.active}).subscribe(
        (response) => {
          console.log(response);
          this.getDemandes();
          this.router.navigate(['/list-demandes'])
        }
      )
  }


  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
}
}
