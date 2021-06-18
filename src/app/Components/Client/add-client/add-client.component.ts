import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { ClientService } from 'src/app/Services/client.service';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from 'src/app/Models/client';
import { ToastrService } from 'ngx-toastr';
import { Villes } from 'src/app/Villes.types';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {

  ClientForm : FormGroup;

  constructor(private clientservice : ClientService ,
              private router : Router,
              private toastr : ToastrService) { }

  ngOnInit(): void {
    this.ClientForm = new FormGroup({
      name : new FormControl('' , Validators.required),
      cin : new FormControl(null , [Validators.required , Validators.pattern('[0-9]{8}')]),
      email : new FormControl('' , [Validators.required , Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      ville : new FormControl('' , Validators.required),
      gouvernorat : new FormControl('' , Validators.required),
      adresse : new FormControl('' , Validators.required),
      codePostal : new FormControl(null , [Validators.required , Validators.pattern('[1-9][0-9]{3}')]),
      dateNaissance : new FormControl(null , [Validators.required]),
      telephone :  new FormControl(null , [Validators.required , Validators.pattern('[0-9]{8}')])
    })
  }

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();


  @ViewChild('instanceVille', {static: true}) instanceVille: NgbTypeahead;
  focusVille$ = new Subject<string>();
  clickVille$ = new Subject<string>();

  
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


  // Show Listes Villes in Select input
  searchVille: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickVille$.pipe(filter(() => !this.instanceVille.isPopupOpen()));
    const inputFocus$ = this.focusVille$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Villes[this.ClientForm.get('gouvernorat').value]
        : Villes[this.ClientForm.get('gouvernorat').value].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  // getter for better access to form fields
  get f() { return this.ClientForm.controls; }

  
  // Add Client
  public addClient() {
    if (this.ClientForm.valid) {
      this.clientservice.addClients({...this.ClientForm.value , active : true}).subscribe(
        (response : Client) => {
          console.log(response);
          this.clientservice.getClients();
          this.router.navigate(['list-clients'])
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
    this.toastr.success('Client ajouté avec succée !');
    }

  showError() {
    this.toastr.error('remplissez tous les champs correctement !');
  }

}



