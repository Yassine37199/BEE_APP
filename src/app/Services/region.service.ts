import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Region } from '../Models/region';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  public getRegions() : Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiServerUrl}/region/list`);
  }

  public findRegionByName(regionName : string) : Observable<Region> {
    return this.http.get<Region>(`${this.apiServerUrl}/region/name/${regionName}`);
  }

  public getRegion(idRegion : number) : Observable<Region> {
    return this.http.get<Region>(`${this.apiServerUrl}/region/${idRegion}`);
  }   

  public addRegion(region : Region , idUser : number) : Observable<Region> {
    return this.http.post<Region>(`${this.apiServerUrl}/region/add/${idUser}` , region);
  }

  public updateRegion(region : Region , idRegion : number , idUser : number) {
    return this.http.put<Region>(`${this.apiServerUrl}/region/update/${idRegion}/${idUser}` , region);
  }


}
