import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-update-region',
  templateUrl: './update-region.component.html',
  styleUrls: ['./update-region.component.css']
})
export class UpdateRegionComponent implements OnInit {

  public id;
  public RegionToUpdate : Region;
  usersN2;
  agentsTT;
  userN2;
  agentTT;
  agentToAdd: AgentTT;
  userToAdd: User;

  constructor(private regionservice : RegionService ,
              private router : Router ,
              private route : ActivatedRoute,
              private toastr : ToastrService,
              private agentservice : AgentTTService,
              private userservice : UserService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.id = params.get('id');
      } 
    );

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

    this.regionservice.getRegion(this.id).subscribe(
      response => {
        this.RegionToUpdate = response;
        this.agentTT = this.RegionToUpdate.agentTT.email;
        this.userN2 = this.RegionToUpdate.user.email;
      }
    )
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


public onUpdateRegion(regionUpdate) : void {

  this.agentservice.findAgentByEmail(regionUpdate.agentTT).subscribe(
    (response) => this.agentToAdd = response
  )

  this.userservice.findUserByEmail(regionUpdate.userN2).subscribe(
    (response) => {
      console.log(regionUpdate);
     
        let region : Region = {
          regionName : regionUpdate.regionName,
          agentTT : this.agentToAdd,
          user : null
        }       
        this.regionservice.updateRegion({...region , regionName : regionUpdate.regionName}, this.id ,  response.idUser).subscribe(
          (response : Region) => {
            console.log(response);
            this.regionservice.getRegions();
            this.router.navigate(['list-regions'])
            this.showSuccess()
          }
        )

    }
  )
}


  showSuccess() {
    this.toastr.success('Région modifié avec succée !');
    }

}
