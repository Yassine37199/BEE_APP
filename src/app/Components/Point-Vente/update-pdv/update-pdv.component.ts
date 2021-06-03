import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { PointVente } from 'src/app/Models/point-vente';
import { PointVenteService } from 'src/app/Services/point-vente.service';
import { Villes } from 'src/app/Villes.types';

@Component({
  selector: 'app-update-pdv',
  templateUrl: './update-pdv.component.html',
  styleUrls: ['./update-pdv.component.css']
})
export class UpdatePdvComponent implements OnInit {
 
  public id;
  public PDVToUpdate : PointVente;

  constructor(private pdvservice : PointVenteService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.pdvservice.getPoint(this.id).subscribe(
      response => {
        this.PDVToUpdate = response; 
      }
    )
  }


  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

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


public onUpdatePDV(point : PointVente) : void {
  if(window.confirm("Modifier cet Point de vente?")){
      this.pdvservice.updatePoint(this.id , {...point , idAgence : this.id}).subscribe(
        (response : PointVente) => {
          this.pdvservice.getPoints();
          this.router.navigate(['list-pdv']);
          this.showSuccess();
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }
  }

  showSuccess() {
    this.toastr.success('Role modifié avec succée !');
    }

}
