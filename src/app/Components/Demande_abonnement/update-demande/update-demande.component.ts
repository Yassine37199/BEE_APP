import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-update-demande',
  templateUrl: './update-demande.component.html',
  styleUrls: ['./update-demande.component.css']
})
export class UpdateDemandeComponent implements OnInit {

  public id;
  public DemandeToUpdate;
  

  // Form Fields
  frequencePaiement;
  adresseInstallation; 
  gouvernorat;
  ville;
  telADSL;
  typeDemande;
  
  clients;
  agences;
  offres;

  client : string;
  agence : string;
  offre : string;

  clientToAdd : Client;
  pointToAdd : PointVente;
  offreToAdd : Offre;

  Form : NgForm;
  agentBackOffice: any;

  constructor(private demandeservice : DemandeAbonnementService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService,
              private clientservice : ClientService,
              private pdvservice : PointVenteService,
              private offreservice : OffreService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.clientservice.getClients().subscribe(
      (response) => this.clients = response.map(c => c.cin)
    )

    this.pdvservice.getPoints().subscribe(
      (response) => this.agences = response.map(a => a.intitule)
    )

    this.offreservice.getOffres().subscribe(
      (response) => this.offres = response.map(o => o.labelle)
    )


    this.demandeservice.getDemande(this.id).subscribe(
      response => {
        console.log(response);
        this.DemandeToUpdate = response;
        this.frequencePaiement = response.frequencePaiement;
        this.adresseInstallation = response.adresseInstallation;
        this.gouvernorat = response.gouvernorat;
        this.ville = response.ville;
        this.telADSL = response.telADSL;
        this.typeDemande = response.typeDemande;
        this.client = this.DemandeToUpdate.client.cin;
        this.offre = this.DemandeToUpdate.offre.labelle;
        this.agence = this.DemandeToUpdate.agence.intitule;
        this.agentBackOffice = this.DemandeToUpdate.agentBackOffice
      }
    )
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
      map(term => (term === '' ? Villes[this.gouvernorat]
        : Villes[this.gouvernorat].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
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



async onUpdateDemande() {
  console.log(this.client);
  await  this.clientservice.getClientByCIN(parseInt(this.client)).subscribe(
    (response : Client) => {
      this.clientToAdd = response
    }
  )

  await  this.pdvservice.getPointByIntitule(this.agence).subscribe(
   (response : PointVente) => this.pointToAdd = response
  )

  await  this.offreservice.getOffreByLabelle(this.offre).subscribe(
   (response : Offre) => this.offreToAdd = response
  )
 
    if(window.confirm("Modifier cette Demande ?")){
      let demande : DemandeAbonnement = {
        idDemandeAbonnement : this.id,
        frequencePaiement : this.frequencePaiement,
        adresseInstallation : this.adresseInstallation,
        etat : this.DemandeToUpdate.etat,
        gouvernorat : this.gouvernorat,
        ville : this.ville,
        telADSL : this.telADSL,
        typeDemande : this.typeDemande,
        agentBackOffice : this.agentBackOffice 
      }

        this.demandeservice.updateDemande(this.id , 
          this.clientToAdd.idClient , 
          this.offreToAdd.idOffre , 
          this.pointToAdd.idAgence , 
          demande).subscribe(
          (response : DemandeAbonnement) => {
            this.demandeservice.getDemandes();
            this.router.navigate(['list-demandes']);
            this.showSuccess();
          },
          (error : HttpErrorResponse) => {alert(error.message);
          }
        );
      }
    }



  showSuccess() {
    this.toastr.success('Demande modifiée avec succée !');
    }

}
