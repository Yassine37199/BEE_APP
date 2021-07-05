import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Languages } from 'src/app/Languages';
import { Modem } from 'src/app/Models/modem';
import { ModemService } from 'src/app/Services/modem.service';

@Component({
  selector: 'app-list-modems',
  templateUrl: './list-modems.component.html',
  styleUrls: ['./list-modems.component.css']
})
export class ListModemsComponent implements OnInit {

  dtOptions : DataTables.Settings = {};
  public modems : Modem[];
  dtTrigger : Subject<any> = new Subject<any>();

  constructor(private modemservice : ModemService,
              private router : Router,
              private toastr : ToastrService) { }

  ngOnInit(): void {
    this.getModems();
  }

  public getModems() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language : Languages
    };
    
    // Get modems From Backend
    this.modemservice.getModems().subscribe(
      (response : Modem[]) => {
        this.modems = response;
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  
  // Open Update Page
  openUpdateModem(myObj : Modem) {
    this.router.navigate(['update-modem/' + myObj['idConfig']])
  }

  deleteModem(modem : Modem) {
    if (window.confirm('Supprimer ce modem ?')){
    this.modemservice.deleteModem(modem.idConfig).subscribe(
      (response)=> {
        console.log(response)
        this.modemservice.getModems();
        this.router.navigate(['list-mdms'])
        this.showSuccess();
      }
    )
  }
  }
  
  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

    showSuccess() {
    this.toastr.success('Modem Supprimé avec succée !');
    }
    
    showError() {
    this.toastr.error('Remplir tous les champs correctement !');
    }


}
