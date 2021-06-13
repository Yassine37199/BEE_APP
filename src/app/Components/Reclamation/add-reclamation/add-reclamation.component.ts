import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReclamationTT } from 'src/app/Models/reclamation';
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

  constructor(private reclamationservice : ReclamationService,
              private router : Router,
              private toastr : ToastrService,
              private authservice : AuthService,
              private route : ActivatedRoute) { 

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.idAbonnement = params.get('idAbonnement')
      } 
    );


    this.ReclamationForm = new FormGroup({
      telADSL : new FormControl('' , [Validators.required]),
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
       etat : "créee",
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
