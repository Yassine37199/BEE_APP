import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Offre } from '../Models/offre';

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
  
  public getOffres() : Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiServerUrl}/offre/list`);
  }
  
  
  public getOffre(idOffre : number) : Observable<Offre> {
    return this.http.get<Offre>(`${this.apiServerUrl}/offre/${idOffre}`);
  }

  
  // Ajouter Un offre
  public addOffre(offre : Offre) : Observable<Offre> {
    return this.http.post<Offre>(`${this.apiServerUrl}/offre/add` , offre);
  }


  // Modifier un offre
  public updateOffre(idOffre : number , offre : Offre) : Observable<Offre> {
    return this.http.put<Offre>(`${this.apiServerUrl}/offre/update/${idOffre}` , offre);
  }
}
