import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Languages } from 'src/app/Languages';
import { Offre } from 'src/app/Models/offre';
import { OffreService } from 'src/app/Services/offre.service';

@Component({
  selector: 'app-list-offres',
  templateUrl: './list-offres.component.html',
  styles: ['@media only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px)  { td:nth-of-type(1):before { content: "Labelle Offre"; } td:nth-of-type(2):before { content: "Débit Offre"; } td:nth-of-type(3):before { content: "Active"; } td:nth-of-type(4):before {content : "Actions";}}'
  ]
})
export class ListOffresComponent implements OnInit {

  dtOptions : DataTables.Settings = {};
  public offres : Offre[];
  dtTrigger : Subject<any> = new Subject<any>();

  constructor(private offreservice : OffreService,
              private router : Router) { }

  ngOnInit(): void {
    this.getOffres();
  }

  public getOffres() : void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language : Languages
    };
    
    // Get Users From Backend
    this.offreservice.getOffres().subscribe(
      (response : Offre[]) => {
        this.offres = response;
        this.dtTrigger.next()
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  async ArchiverOffre(offre : Offre){
    await this.offreservice.updateOffre(offre.idOffre,
      {...offre , active : !offre.active}).subscribe(
        (response) => {
          console.log(response);
          this.getOffres();
          this.router.navigate(['/list-offres'])
        }
      )
  }
  
  // Open Update Page
  openUpdateOffre(myObj) {
    this.router.navigate(['update-offre/' + myObj['idOffre']])
  }
  
  ngOnDestroy(): void  {
    this.dtTrigger.unsubscribe();
  }

}
