import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Facture } from '../Models/facture';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiServerUrl = environment.factureApiUrl;

  constructor(private http : HttpClient) { }

  public FactureImpayeByRefTT(refTT : string) : Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiServerUrl}/facture/get/impaye/${refTT}`)
  }

  public FactureImpaye() : Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiServerUrl}/facture/get/impaye`)
  }

  public FacturePaye(refTT : string) : Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiServerUrl}/facture/get/paye/${refTT}`)
  }

  public FacturesByRefTT(refTT : string) : Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiServerUrl}/facture/get/${refTT}`)
  }
}
