import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReclamationTT } from 'src/app/Models/reclamation';
import { ReclamationService } from 'src/app/Services/reclamation.service';

@Component({
  selector: 'app-update-reclamation',
  templateUrl: './update-reclamation.component.html',
  styleUrls: ['./update-reclamation.component.css']
})
export class UpdateReclamationComponent implements OnInit {

  public id;
  public ReclamationToUpdate : ReclamationTT;
  idAbonnement;

  constructor(private reclamationservice : ReclamationService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.reclamationservice.getReclamation(this.id).subscribe(
      response => {
        this.ReclamationToUpdate = response;
        this.idAbonnement = response.abonnement.idAbonnement
      }
    )
  }



public onUpdateReclamation(reclamation : ReclamationTT) : void {

      this.reclamationservice.updateReclamation(this.id,
        {...reclamation,
         dateEtat : new Date(),
         dateReclamation : this.ReclamationToUpdate.dateReclamation,
         etat : this.ReclamationToUpdate.etat
        },
        this.idAbonnement).subscribe(
        (response : ReclamationTT) => {
          this.reclamationservice.getReclamationByAbonnement(this.idAbonnement);
          this.router.navigate(['abonnement-details/' + this.idAbonnement]);
          this.showSuccess();
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
  }


  showSuccess() {
    this.toastr.success('Réclamation TT modifié avec succée !');
    }


}
