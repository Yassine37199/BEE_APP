import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Offre } from 'src/app/Models/offre';
import { OffreService } from 'src/app/Services/offre.service';
import { RoleService } from 'src/app/Services/role.service';

@Component({
  selector: 'app-update-offre',
  templateUrl: './update-offre.component.html',
  styleUrls: ['./update-offre.component.css']
})
export class UpdateOffreComponent implements OnInit {

  public id;
  public OffreToUpdate : Offre;

  constructor(private offreservice : OffreService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.offreservice.getOffre(this.id).subscribe(
      response => {
        this.OffreToUpdate = response;
      }
    )
  }


public onUpdateOffre(offre : Offre) : void {
  if(window.confirm("Modifier cet Offre ?")){
      this.offreservice.updateOffre(this.id , {...offre , idOffre : this.id}).subscribe(
        (response : Offre) => {
          this.offreservice.getOffres();
          this.router.navigate(['list-offres']);
          this.showSuccess();
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }
  }

  showSuccess() {
    this.toastr.success('Offre modifié avec succée !');
    }
}
