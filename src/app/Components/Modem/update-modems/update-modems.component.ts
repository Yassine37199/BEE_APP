import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Abonnement } from 'src/app/Models/abonnement';
import { Modem } from 'src/app/Models/modem';
import { AbonnementsService } from 'src/app/Services/abonnements.service';
import { ModemService } from 'src/app/Services/modem.service';

@Component({
  selector: 'app-update-modems',
  templateUrl: './update-modems.component.html',
  styleUrls: ['./update-modems.component.css']
})
export class UpdateModemsComponent implements OnInit {

  public id;
  public ModemToUpdate : Modem;
  public idAbonnement;
  public abonnement : Abonnement;

  constructor(private modemservice : ModemService ,
              private router : Router,
              private route : ActivatedRoute,
              private abonnementservice : AbonnementsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
        console.log(this.id);
      } 
    );

    this.modemservice.getModem(this.id).subscribe(
      response => {
        this.ModemToUpdate = response;
        this.idAbonnement = this.ModemToUpdate.abonnement.idAbonnement;
        this.abonnementservice.getAbonnement(this.idAbonnement).subscribe(
          response => this.abonnement = response
        )
      }
    )
  }



public onUpdateModem(modemUpdt : Modem) : void {
     if(window.confirm("Modifier ce modem ?")){
      let modem = {
        ...modemUpdt,
        abonnement : this.abonnement
      }
      console.log(modem)
      this.modemservice.updateModem(this.id , modem).subscribe(
        (response : Modem) => {
          console.log(response);
          this.modemservice.getModems();
          this.router.navigate(['list-mdms']);
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }
  }

}
