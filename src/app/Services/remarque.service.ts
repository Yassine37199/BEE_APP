import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Remarque } from '../Models/remarque';

@Injectable({
  providedIn: 'root'
})
export class RemarqueService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  public getRemarqueByDemande(idDemandeAbonnement : number) : Observable<Remarque[]> {
    return this.http.get<Remarque[]>(`${this.apiServerUrl}/remarque/get/demande/${idDemandeAbonnement}`);
  }

  public getRemarqueByAbonnement(idAbonnement : number) : Observable<Remarque[]> {
    return this.http.get<Remarque[]>(`${this.apiServerUrl}/remarque/get/abonnement/${idAbonnement}`);
  }  

  public addRemarqueForAbonnement(remarque : Remarque , idUser : number , idAbonnement : number) : Observable<Remarque> {
    return this.http.post<Remarque>(`${this.apiServerUrl}/remarque/addAbn/${idAbonnement}/${idUser}` , remarque);
  }

  public addRemarqueForDemande(remarque : Remarque , idUser : number , idDemandeAbonnement : number) : Observable<Remarque> {
    return this.http.post<Remarque>(`${this.apiServerUrl}/remarque/addDem/${idDemandeAbonnement}/${idUser}` , remarque);
  }

}
