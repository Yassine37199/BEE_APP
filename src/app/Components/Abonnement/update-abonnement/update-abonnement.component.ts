import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Abonnement } from 'src/app/Models/abonnement';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { PointVenteService } from 'src/app/Services/point-vente.service';

@Component({
  selector: 'app-update-abonnement',
  templateUrl: './update-abonnement.component.html',
  styleUrls: ['./update-abonnement.component.css']
})
export class UpdateAbonnementComponent implements OnInit {

  public id;
  public abonnementToUpdate : Abonnement;
  agences;

  constructor(private abonnementservice : AbonnementsService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService,
              private pdvservice : PointVenteService,
              private _location : Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.pdvservice.getPoints().subscribe(
      (response) => this.agences = response.map(a => a.intitule)
    )

    this.abonnementservice.getAbonnement(this.id).subscribe(
      response => {
        console.log(response);
        this.abonnementToUpdate = response;
      }
    )
  }


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


  public onUpdateAbonnement(abonnementUpdate : Abonnement) : void {
    if(window.confirm("Modifier cet abonnement ?")){
        this.abonnementservice.updateAbonnement(this.id , this.abonnementToUpdate.demandeAbonnement.idDemandeAbonnement , {...abonnementUpdate , refTT : abonnementUpdate.refTT , active : abonnementUpdate.active}).subscribe(
          (response : Abonnement) => {
            this.abonnementservice.getAbonnements();
            this.router.navigate(['list-abonnements']);
            this.showSuccess();
          },
          (error : HttpErrorResponse) => {alert(error.message);
          }
        );
      }
    }

    goBack(){
      this._location.back()
    }


  showSuccess() {
    this.toastr.success('Abonnement modifié avec succée !');
    }

}
