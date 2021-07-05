import { Component, OnInit } from '@angular/core';
import { Facture } from 'src/app/Models/facture';
import { AuthService } from 'src/app/Services/auth.service';
import { FactureService } from 'src/app/Services/facture.service';

@Component({
  selector: 'app-stat-recouv',
  templateUrl: './stat-recouv.component.html',
  styleUrls: ['./stat-recouv.component.css']
})
export class StatRecouvComponent implements OnInit {

  factures : Facture[];
  countImpaye = 0;

  constructor(private factureservice : FactureService) { }

  ngOnInit(): void {

    this.getFacturesImpayeCount();
  }

  getFacturesImpayeCount(){
    this.factureservice.FactureImpaye().subscribe(
      response => {
        this.factures = response
        this.countImpaye = this.factures.reduce((acc , ticket) => acc + 1 , 0);
      }
    )
  } 

}
