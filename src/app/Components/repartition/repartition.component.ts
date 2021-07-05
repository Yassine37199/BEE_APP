import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DemandeAbonnement } from 'src/app/Models/demande-abonnement';
import { User } from 'src/app/Models/user';
import { AuthService } from 'src/app/Services/auth.service';
import { DemandeAbonnementService } from 'src/app/Services/demande-abonnement.service';
import { RemarqueService } from 'src/app/Services/remarque.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-repartition',
  templateUrl: './repartition.component.html',
  styleUrls: ['./repartition.component.css']
})
export class RepartitionComponent implements OnInit {

  countDemandes : number;
  demandes;
  usersBackoffice;

  constructor(private demandeservice : DemandeAbonnementService,
              private userservice : UserService,
              private toastr : ToastrService,
              private remarqueservice : RemarqueService,
              private authservice : AuthService) { }

  ngOnInit(): void {
    this.getDemandesCount();
    this.userservice.getUsersBackOffice().subscribe(
      (response : User[]) => {
        console.log(response);
        this.usersBackoffice = response.map(user => user.email)
      }
    )
  }

  getDemandesCount(){
    this.demandeservice.getDemandes().subscribe(
      response => {
        this.demandes = response
        this.countDemandes = this.demandes.reduce((acc, demande : DemandeAbonnement) => 
          {
            if (demande.agentBackOffice == null) return acc + 1
            else return acc
          }, 0)
        console.log(this.countDemandes)
      }
      
    )
  } 

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.usersBackoffice
        : this.usersBackoffice.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
 

  // Répartir Demandes aux agents
  onSubmit(repartForm){
    if(repartForm.count > this.countDemandes){
      this.showError()
    }
    else{
    this.demandeservice.getDemandeRepartition().subscribe(
      (response : DemandeAbonnement[]) => {
        console.log(response)
        response.filter((demande , idc) => idc < repartForm.count).map( demande => {
          this.demandeservice.updateDemande(
            demande.idDemandeAbonnement,
            demande.client.idClient ,
            demande.offre.idOffre ,
            demande.agence.idAgence ,
            {...demande , agentBackOffice : repartForm.agent}).subscribe(
              (response) => {
                console.log(response)
                this.remarqueservice.addRemarqueForDemande(
                  {text : `Demande Affectée au ${repartForm.agent}`},
                  this.authservice.getCurrentUser().idUser,
                  response.idDemandeAbonnement).subscribe(
                    (response) => console.log(response)
                  )
                
              }
            )
        })
        this.showSuccess()
      }
    );
    }
  }

  showSuccess() {
    this.toastr.success('Repartition effectué avec succée !');
    }

  showError() {
    this.toastr.error('Erreur de Répartition !');
  }

}
