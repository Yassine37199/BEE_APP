import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Client } from 'src/app/Models/client';
import { ClientService } from 'src/app/Services/client.service';
import { Villes } from 'src/app/Villes.types';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent implements OnInit {

  public id;
  public ClientToUpdate : Client;
  gouvernorat : string;

  constructor(private clientservice : ClientService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService,
              private _location : Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

    this.clientservice.getClient(this.id).subscribe(
      response => {
        this.ClientToUpdate = response;
      }
    )
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
      map(term => (term === '' ? Villes[this.gouvernorat]
        : Villes[this.gouvernorat].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

 
  changeGov(editForm : NgForm) {
    console.log(editForm.controls['gouvernorat'].value);
    this.gouvernorat = editForm.controls['gouvernorat'].value;
  }


public onUpdateClient(client : Client) : void {
  if(window.confirm("Modifier ce client ?")){
      this.clientservice.updateClient(this.id , {...client , idClient : this.id , active : this.ClientToUpdate.active}).subscribe(
        (response : Client) => {
          this.clientservice.getClients();
          this.router.navigate(['list-clients']);
          this.showSuccess();
        },
        (error : HttpErrorResponse) => {alert(error.message);
        }
      );
    }
  }

  goBack(){
    this._location.back()
  }

  showSuccess() {
    this.toastr.success('Client modifié avec succée !');
    }

}
