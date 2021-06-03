import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Abonnement } from '../Models/abonnement';

@Injectable({
  providedIn: 'root'
})
export class AbonnementsService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) {}
  
  
  public getAbonnements() : Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(`${this.apiServerUrl}/abonnement/list`);
  }
  
  
  public getAbonnement(idAbonnement : number) : Observable<Abonnement> {
    return this.http.get<Abonnement>(`${this.apiServerUrl}/abonnement/${idAbonnement}`);
  }

  
  // Ajouter d'abonnement
  public addAbonnement(abonnement : Abonnement , idDemandeAbonnement : number) : Observable<Abonnement> {
    return this.http.post<Abonnement>(`${this.apiServerUrl}/abonnement/add/${idDemandeAbonnement}` , abonnement);
  }


  //Modifier Un abonnement
  public updateAbonnement(idAbonnement : number , abonnement : Abonnement) : Observable<Abonnement> {
    return this.http.put<Abonnement>(`${this.apiServerUrl}/abonnement/update/${idAbonnement}` , abonnement);
  }
}
