import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReclamationTT } from '../Models/reclamation';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
  
  public getReclamationByAbonnement(idAbonnement : number) : Observable<ReclamationTT[]> {
    return this.http.get<ReclamationTT[]>(`${this.apiServerUrl}/reclamationTT/list/abonnement/${idAbonnement}`);
  }
  
  
  public getReclamation(idReclamation : number) : Observable<ReclamationTT> {
    return this.http.get<ReclamationTT>(`${this.apiServerUrl}/reclamationTT/${idReclamation}`);
  }

  
  // Ajouter Une Reclamation TT
  public addReclamation(reclamation : ReclamationTT , idAbonnement : number , idUser : Number) : Observable<ReclamationTT> {
    return this.http.post<ReclamationTT>(`${this.apiServerUrl}/reclamationTT/add/${idUser}/${idAbonnement}` , reclamation);
  }


  // Modifier Une Reclamation TT
  public updateReclamation(idReclamation : number , reclamation : ReclamationTT , idAbonnement : number) : Observable<ReclamationTT> {
    return this.http.put<ReclamationTT>(`${this.apiServerUrl}/reclamationTT/update/${idReclamation}/${idAbonnement}` , reclamation);
  }
}
