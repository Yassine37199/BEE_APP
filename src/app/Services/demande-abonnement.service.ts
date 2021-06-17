import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DemandeAbonnement } from '../Models/demande-abonnement';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DemandeAbonnementService {

  private apiServerUrl = environment.apiUrl;
  currentUser;

  constructor(private http : HttpClient) { }
  
  
  
  public getDemandes() : Observable<DemandeAbonnement[]> {
    return this.http.get<DemandeAbonnement[]>(`${this.apiServerUrl}/demandeAbonnement/list`);
  }

  
  
  public getDemande(idDemandeAbonnement : number) : Observable<DemandeAbonnement> {
    return this.http.get<DemandeAbonnement>(`${this.apiServerUrl}/demandeAbonnement/${idDemandeAbonnement}`);
  }
  
  // get Liste des demandes pour les agents backoffice
  public getDemandeByBackOffice(agentBack : string) : Observable<DemandeAbonnement[]> {
    return this.http.get<DemandeAbonnement[]>(`${this.apiServerUrl}/demandeAbonnement/get/backoffice/${agentBack}`);
  }
  
  public getDemandeRepartition() : Observable<DemandeAbonnement[]>{
    return this.http.get<DemandeAbonnement[]>(`${this.apiServerUrl}/demandeAbonnement/get/repartiton`);
  }
  
  // Ajouter Une Demande d'abonnement
  public addDemande(demande : DemandeAbonnement , idClient : number , idOffre : number , idAgence : number) : Observable<DemandeAbonnement> {
    return this.http.post<DemandeAbonnement>(`${this.apiServerUrl}/demandeAbonnement/add/${idClient}/${idOffre}/${idAgence}`,
     demande);
  }


  //Modifier Une Demande d'abonnement
  public updateDemande(idDemandeAbonnement : number ,
                       idClient : number , 
                       idOffre : number ,
                       idAgence : number ,
                       demande : DemandeAbonnement) : Observable<DemandeAbonnement> {
    return this.http.put<DemandeAbonnement>(`${this.apiServerUrl}/demandeAbonnement/update/${idDemandeAbonnement}/${idClient}/${idOffre}/${idAgence}` , demande);
  }
}
