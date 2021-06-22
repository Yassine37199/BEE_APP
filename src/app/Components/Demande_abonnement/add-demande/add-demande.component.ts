import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Client } from 'src/app/Models/client';
import { DemandeAbonnement } from 'src/app/Models/demande-abonnement';
import { Offre } from 'src/app/Models/offre';
import { PointVente } from 'src/app/Models/point-vente';
import { ClientService } from 'src/app/Services/client.service';
import { DemandeAbonnementService } from 'src/app/Services/demande-abonnement.service';
import { OffreService } from 'src/app/Services/offre.service';
import { PointVenteService } from 'src/app/Services/point-vente.service';
import { Villes } from 'src/app/Villes.types';

@Component({
  selector: 'app-add-demande',
  templateUrl: './add-demande.component.html',
  styleUrls: ['./add-demande.component.css']
})
export class AddDemandeComponent implements OnInit {

  DemandeForm : FormGroup;
  
  clients;
  agences;
  offres;

  clientToAdd : Client;
  pointToAdd : PointVente;
  offreToAdd : Offre;

  constructor(private demandeservice : DemandeAbonnementService ,
              private router : Router,
              private toastr : ToastrService,
              private clientservice : ClientService,
              private pdvservice : PointVenteService,
              private offreservice : OffreService,
              private _location : Location) { }

  ngOnInit(): void {
     
    this.clientservice.getClients().subscribe(
      (response) => this.clients = response.map(c => c.cin)
    )

    this.pdvservice.getPoints().subscribe(
      (response) => this.agences = response.map(a => a.intitule)
    )

    this.offreservice.getOffres().subscribe(
      (response) => this.offres = response.map(o => o.labelle)
    )


    this.DemandeForm = new FormGroup({
      frequencePaiement : new FormControl('' , Validators.required),
      adresseInstallation : new FormControl('' , [Validators.required]),
      ville : new FormControl('' , Validators.required),
      gouvernorat : new FormControl('' , Validators.required),
      telADSL :  new FormControl(null , [Validators.required , Validators.pattern('[0-9]{8}')]),
      typeDemande : new FormControl('' , Validators.required),
      client : new FormControl(null , [Validators.required]),
      offre : new FormControl(null , [Validators.required]),
      agence : new FormControl(null , [Validators.required]), 
    })
  }

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  @ViewChild('instanceVille', {static: true}) instanceVille: NgbTypeahead;
  focusVille$ = new Subject<string>();
  clickVille$ = new Subject<string>();


  @ViewChild('instanceClient', {static: true}) instanceClient: NgbTypeahead;
  focusClient$ = new Subject<string>();
  clickClient$ = new Subject<string>();


  @ViewChild('instanceOffre', {static: true}) instanceOffre: NgbTypeahead;
  focusOffre$ = new Subject<string>();
  clickOffre$ = new Subject<string>();

  @ViewChild('instanceAgence', {static: true}) instanceAgence: NgbTypeahead;
  focusAgence$ = new Subject<string>();
  clickAgence$ = new Subject<string>();

  
  // Show Listes Governorats in Select input
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Object.keys(Villes)
        : Object.keys(Villes).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  // Show Listes Villes in Select input
  searchVille: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickVille$.pipe(filter(() => !this.instanceVille.isPopupOpen()));
    const inputFocus$ = this.focusVille$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Villes[this.DemandeForm.get('gouvernorat').value]
        : Villes[this.DemandeForm.get('gouvernorat').value].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  // Show Listes Clients in Select input
  searchClients: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickClient$.pipe(filter(() => !this.instanceClient.isPopupOpen()));
    const inputFocus$ = this.focusClient$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.clients
        : this.clients.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  // Show Listes Offres in Select input
  searchOffres: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickOffre$.pipe(filter(() => !this.instanceOffre.isPopupOpen()));
    const inputFocus$ = this.focusOffre$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.offres
        : this.offres.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


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

  // getter for better access to form fields
  get f() { return this.DemandeForm.controls; }

  
  // Add Client
  async addDemande() {

    await  this.clientservice.getClientByCIN(parseInt(this.DemandeForm.get('client').value)).subscribe(
       (response : Client) => {
         this.clientToAdd = response
       }
     )

    await  this.pdvservice.getPointByIntitule(this.DemandeForm.get('agence').value).subscribe(
      (response : PointVente) => this.pointToAdd = response
    )

   await  this.offreservice.getOffreByLabelle(this.DemandeForm.get('offre').value).subscribe(
      (response : Offre) => this.offreToAdd = response
    )
    


    if (this.DemandeForm.valid) {
      let demande = {frequencePaiement : this.DemandeForm.get('frequencePaiement').value,
                    adresseInstallation : this.DemandeForm.get('adresseInstallation').value,
                    ville : this.DemandeForm.get('ville').value,
                    gouvernorat : this.DemandeForm.get('gouvernorat').value,
                    telADSL :  this.DemandeForm.get('telADSL').value,
                    typeDemande : this.DemandeForm.get('typeDemande').value,
                    etat : 'active',
                    agentBackOffice : null,
                    active : true
                  }

      this.demandeservice.addDemande(demande,
                                    this.clientToAdd.idClient,
                                    this.offreToAdd.idOffre,
                                    this.pointToAdd.idAgence,
                                     ).subscribe(
        (response : DemandeAbonnement) => {
          console.log(response);
          this.demandeservice.getDemandes();
          this.router.navigate(['list-demandes']) 
          this.showSuccess();
        }
      )
    }
    else {
      this.showError();
      return;
    }
  }

  goBack(){
    this._location.back()
  }

  showSuccess() {
    this.toastr.success('Demande ajouté avec succée !');
    }

  showError() {
    this.toastr.error('remplissez tous les champs correctement !');
  }


}
