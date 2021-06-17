import { Component, OnInit } from '@angular/core';
import { DemandeAbonnement } from 'src/app/Models/demande-abonnement';
import { AuthService } from 'src/app/Services/auth.service';
import { DemandeAbonnementService } from 'src/app/Services/demande-abonnement.service';

@Component({
  selector: 'app-stats-dmndes',
  templateUrl: './stats-dmndes.component.html',
  styleUrls: ['./stats-dmndes.component.css']
})
export class StatsDmndesComponent implements OnInit {

  demandes : DemandeAbonnement[];
  countDemandes = 0;

  constructor(private demandeservice : DemandeAbonnementService , private authservice : AuthService) { }

  ngOnInit(): void {

    this.getDemandesCount();
  }

  getDemandesCount(){
    this.demandeservice.getDemandeByBackOffice(this.authservice.getCurrentUser().email).subscribe(
      response => {
        this.demandes = response
        this.countDemandes = this.demandes.reduce((acc , ticket) => acc + 1 , 0);
      }
    )
  } 

}
