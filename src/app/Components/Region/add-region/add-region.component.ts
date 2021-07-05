import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AgentTT } from 'src/app/Models/agentTT';
import { Region } from 'src/app/Models/region';
import { User } from 'src/app/Models/user';
import { AgentTTService } from 'src/app/Services/agent-tt.service';
import { RegionService } from 'src/app/Services/region.service';
import { UserService } from 'src/app/Services/user.service';
import { Villes } from 'src/app/Villes.types';

@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.css']
})
export class AddRegionComponent implements OnInit {

  usersN2;
  agentsTT;

  agentToAdd;

  RegionForm : FormGroup

    constructor(private regionservice : RegionService ,
                private router : Router ,
                private userservice : UserService,
                private toastr : ToastrService,
                private agentservice : AgentTTService,
                private _location : Location){

    } 

    ngOnInit(): void {
      this.userservice.getUsersN2().subscribe(
        (response : User[]) => {
          this.usersN2 = response.map(user => user.email)
        }
      )

      this.agentservice.getAgentsTT().subscribe(
        (response : AgentTT[]) => {
          this.agentsTT = response.map(agent => agent.email);
        }
      )
      
      this.RegionForm = new FormGroup({
        regionName : new FormControl('' , Validators.required),
        userN2 : new FormControl(''),
        agentTT : new FormControl(''),
      });
    }


  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.usersN2
        : this.usersN2.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  @ViewChild('instanceRegion', {static: true}) instanceRegion: NgbTypeahead;
  focusRegion$ = new Subject<string>();
  clickRegion$ = new Subject<string>();

  
  // Show Listes Governorats in Select input
  searchRegion: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickRegion$.pipe(filter(() => !this.instanceRegion.isPopupOpen()));
    const inputFocus$ = this.focusRegion$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? Object.keys(Villes)
        : Object.keys(Villes).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


  @ViewChild('instanceTT', {static: true}) instanceTT: NgbTypeahead;
  focusTT$ = new Subject<string>();
  clickTT$ = new Subject<string>();

  searchTT: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickTT$.pipe(filter(() => !this.instanceTT.isPopupOpen()));
    const inputFocus$ = this.focusTT$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.agentsTT
        : this.agentsTT.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  // getter for better access to form fields
  get f() { return this.RegionForm.controls; }


  
  public addRegion() : void {
    console.log(this.usersN2);
    this.agentservice.findAgentByEmail(this.RegionForm.get('agentTT').value).subscribe(
      (response) => {
        this.agentToAdd = response
        console.log(response);
      }
    )

    this.userservice.findUserByEmail(this.RegionForm.get('userN2').value).subscribe(
      (response) => {
        console.log(response.idUser);
        if (this.RegionForm.valid) {
          let region : Region = {
            regionName : this.RegionForm.get('regionName').value,
            user : null,
            responsableTT : this.agentToAdd
          }       
          this.regionservice.addRegion(region , response.idUser).subscribe(
            (response : Region) => {
              console.log(response);
              this.regionservice.getRegions();
              this.router.navigate(['list-regions'])
            }
          )
        }

        else {
          this.showError();
          return;
        }

      }
    )
  }

  goBack(){
    this._location.back()
  }

  showSuccess() {
    this.toastr.success('Region ajouté avec succée !');
    }

  showError() {
    this.toastr.error('remplissez tous les champs correctement !');
  }

}
