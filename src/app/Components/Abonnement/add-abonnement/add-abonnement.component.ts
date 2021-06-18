import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Abonnement } from 'src/app/Models/abonnement';
import { PointVente } from 'src/app/Models/point-vente';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { DemandeAbonnementService } from 'src/app/Services/demande-abonnement.service';
import { PointVenteService } from 'src/app/Services/point-vente.service';

@Component({
  selector: 'app-add-abonnement',
  templateUrl: './add-abonnement.component.html',
  styleUrls: ['./add-abonnement.component.css']
})
export class AddAbonnementComponent implements OnInit {

  id;
  AbnForm : FormGroup;
  agences;

  constructor(private route : ActivatedRoute,
              private router : Router,
              private abonnementservice : AbonnementsService,
              private toastr : ToastrService,
              private pdvservice : PointVenteService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.pdvservice.getPoints().subscribe(
      (response) => this.agences = response.map(a => a.intitule)
    )

    this.AbnForm = new FormGroup({
      refTT : new FormControl('' , Validators.required),
      etatTT : new FormControl('' , [Validators.required]),
      agenceLivraison : new FormControl(null , [Validators.required]), 
    })
  }


  // getter for better access to form fields
  get f() { return this.AbnForm.controls; }

  @ViewChild('instanceAgence', {static: true}) instanceAgence: NgbTypeahead;
  focusAgence$ = new Subject<string>();
  clickAgence$ = new Subject<string>();

  // Show Listes Agences in Select input
  searchAgence: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickAgence$.pipe(filter(() => !this.instanceAgence.isPopupOpen()));
    const inputFocus$ = this.focusAgence$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.agences
        : this.agences.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  public addAbonnement() : void {
    if(this.AbnForm.valid) {
      this.abonnementservice.addAbonnement({...this.AbnForm.value , active : true }, this.id).subscribe(
        (response : Abonnement) => {
        console.log(response);
        this.abonnementservice.getAbonnements();
        this.router.navigate(['list-abonnements'])
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
this.toastr.success('Abonnement ajoutée avec succée !');
}

showError() {
this.toastr.error('Remplir tous les champs correctement !');
}



}
