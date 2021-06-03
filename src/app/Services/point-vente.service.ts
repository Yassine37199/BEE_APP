import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PointVente } from '../Models/point-vente';

@Injectable({
  providedIn: 'root'
})
export class PointVenteService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
  
  public getPoints() : Observable<PointVente[]> {
    return this.http.get<PointVente[]>(`${this.apiServerUrl}/agence/list`);
  }
  
  
  public getPoint(idAgence : number) : Observable<PointVente> {
    return this.http.get<PointVente>(`${this.apiServerUrl}/agence/${idAgence}`);
  }

  public getPointByIntitule(intitule : String) : Observable<PointVente> {
    return this.http.get<PointVente>(`${this.apiServerUrl}/agence/intitule/${intitule}`);
  }

  
  // Ajouter Une agence
  public addPoint(pdv : PointVente) : Observable<PointVente> {
    return this.http.post<PointVente>(`${this.apiServerUrl}/agence/add` , pdv);
  }


  // Modifier une agence
  public updatePoint(idAgence : number , agence : PointVente) : Observable<PointVente> {
    return this.http.put<PointVente>(`${this.apiServerUrl}/agence/update/${idAgence}` , agence);
  }
}
