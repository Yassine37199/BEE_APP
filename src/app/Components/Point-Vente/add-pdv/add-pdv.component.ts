import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { PointVente } from 'src/app/Models/point-vente';
import { PointVenteService } from 'src/app/Services/point-vente.service';
import { Villes } from 'src/app/Villes.types';

@Component({
  selector: 'app-add-pdv',
  templateUrl: './add-pdv.component.html',
  styleUrls: ['./add-pdv.component.css']
})
export class AddPdvComponent implements OnInit {

  constructor(private  pointventeservice : PointVenteService ,
    private router : Router,
    private toastr : ToastrService) { }

    PDVForm : FormGroup;



ngOnInit(): void {
  this.PDVForm = new FormGroup({
    type :  new FormControl('' , Validators.required),
    code :  new FormControl('' , Validators.required),
    intitule :  new FormControl('' , Validators.required),
    contact : new FormControl('' , Validators.required),
    tel : new FormControl(null , [Validators.required , Validators.pattern('[0-9]{8}')]),
    adresse : new FormControl('' , Validators.required),
    agence_mere : new FormControl('' , Validators.required),
    region : new FormControl('' , Validators.required),
    etat : new FormControl('' , Validators.required),
    details : new FormControl('' , Validators.required),
  })
}

// getter for better access to form fields
get f() { return this.PDVForm.controls; }


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


// Add Role
public addPDV() {
  if (this.PDVForm.valid) {
    this.pointventeservice.addPoint({...this.PDVForm.value , active : true}).subscribe(
    (response : PointVente) => {
    console.log(response);
    this.pointventeservice.getPoints();
    this.router.navigate(['list-pdv'])
    this.showSuccess();
  }
)
}
  else {
    this.showError();
    return;
}
}

showSuccess() {
this.toastr.success('Point de vente ajouté avec succée !');
}

showError() {
this.toastr.error('Remplir tous les champs correctement !');
}

}
