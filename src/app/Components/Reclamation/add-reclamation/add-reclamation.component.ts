import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReclamationTT } from 'src/app/Models/reclamation';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { AuthService } from 'src/app/Services/auth.service';
import { ReclamationService } from 'src/app/Services/reclamation.service';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.css']
})
export class AddReclamationComponent implements OnInit {

  ReclamationForm : FormGroup;
  idAbonnement;
  telFixe: number;

  constructor(private reclamationservice : ReclamationService,
              private router : Router,
              private toastr : ToastrService,
              private authservice : AuthService,
              private route : ActivatedRoute,
              private abonnementservice : AbonnementsService) { 

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.idAbonnement = params.get('idAbonnement')
      } 
    );

    this.abonnementservice.getAbonnement(this.idAbonnement).subscribe(
      (response) => this.telFixe = response.demandeAbonnement.telADSL
    )


    this.ReclamationForm = new FormGroup({
      telADSL : new FormControl(this.telFixe , [Validators.required]),
      objet : new FormControl('' , [Validators.required]),
    })

    
  }

 
  // getter for better access to form fields
  get f() { return this.ReclamationForm.controls; }

  
  // Add Client
  public addReclamation() {

    if (this.ReclamationForm.valid) {
      let reclamation : ReclamationTT = {
        ...this.ReclamationForm.value,
       dateReclamation : new Date(),
       dateEtat : new Date(),
       etat : "crée",
      }

      this.reclamationservice.addReclamation(reclamation , this.idAbonnement , this.authservice.getCurrentUser().idUser).subscribe(
        (response : ReclamationTT) => {
          this.reclamationservice.getReclamationByAbonnement(this.idAbonnement);
          this.router.navigate(['abonnement-details/' + this.idAbonnement])
          this.showSuccess();
        }
      )
    }
    else {
      this.showError();
      return;
    }
  }

  

  showSuccess() {
    this.toastr.success('Réclamation TT ajouté avec succée !');
    }

  showError() {
    this.toastr.error('remplissez tous les champs correctement !');
  }

}
