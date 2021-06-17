import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Facture } from 'src/app/Models/facture';
import { FactureService } from 'src/app/Services/facture.service';
import { SmsService } from 'src/app/Services/sms.service';

@Component({
  selector: 'app-homepage-recouvrement',
  templateUrl: './homepage-recouvrement.component.html',
  styleUrls: ['./homepage-recouvrement.component.css']
})
export class HomepageRecouvrementComponent implements OnInit {

  FacturesImpaye;

  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject<any>();
  constructor(private factureservice : FactureService,
              private smsservice : SmsService,
              private toastr : ToastrService) { }

  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,

    };
    
    
  }

  public getFactureByRefTT(refTT : string) : void {
    
    this.factureservice.FacturesByRefTT(refTT).subscribe(
      (response : Facture[]) => {
        console.log(response);
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public sendSMS() : void {
    this.factureservice.FactureImpaye().subscribe(
      (response : Facture[]) => {
        console.log(response);
        response.map((facture) => {
          let retard = moment(new Date()).diff(moment(facture.endPeriode) , "days");
          console.log(retard)
          
          switch(retard) {
            case 0 : this.smsservice.SendSMS({phoneNumber : `+216${facture.gsmfac.toString()}`, 
            message : `Cher client, votre facture est disponible, d'un Montant ${facture.montant}DT.Vous avez 10 jours pour la régler afin d'éviter la suspension de votre connexion`}).subscribe(
              (response) => console.log(response)
            );break;


            case 9 : this.smsservice.SendSMS({phoneNumber : `+216${facture.gsmfac.toString()}`,
            
            message : `Cher client, votre facture demure impayée, d'un montant ${facture.montant}DT. Vous avez un delai de 01 jour pour la régler afin d'éviter la suspension de connexion`
          }).subscribe(
              (response) => console.log(response)
            );break;


            case 10 : this.smsservice.SendSMS({phoneNumber : `+216${facture.gsmfac.toString()}` ,
            message : `Cher client, votre compte est débiteur de ${facture.montant}DT. Veuillez régulariser votre situation afin d'éviter de transmettre votre dossier au service contentieux`})
            
            .subscribe(
              (response) => console.log(response)
            );break;
          }
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  })
}

    showSuccess() {
      this.toastr.success('SMS Envoyées avec succées  !');
    }
    
    showError() {
      this.toastr.error('Remplir tous les champs correctement !');
    }



  openUpdateDemande(demande){

  }

}
