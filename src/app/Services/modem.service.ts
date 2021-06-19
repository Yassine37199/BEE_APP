import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Modem } from '../Models/modem';

@Injectable({
  providedIn: 'root'
})
export class ModemService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
  
  public getModems() : Observable<Modem[]> {
    return this.http.get<Modem[]>(`${this.apiServerUrl}/configmodem/list`);
  }
  
  public getModem(idConfig : number) : Observable<Modem> {
    return this.http.get<Modem>(`${this.apiServerUrl}/configmodem/${idConfig}`);
  }

  public getModemByLogin(login : string) : Observable<Modem[]> {
    return this.http.get<Modem[]>(`${this.apiServerUrl}/configmodem/login/${login}`);
  }

  // Ajouter Un Modem
  public addModem(modem : Modem , idAbonnement : number) : Observable<Modem> {
    return this.http.post<Modem>(`${this.apiServerUrl}/configmodem/add/${idAbonnement}` , modem);
  }

  // Modifier un modem
  public updateModem(idConfig : number , modem : Modem) : Observable<Modem> {
    return this.http.put<Modem>(`${this.apiServerUrl}/configmodem/update/${idConfig}` , modem);
  }

  public deleteModem(idConfig : number){
    return this.http.delete<Modem>(`${this.apiServerUrl}/configmodem/delete/${idConfig}`);
  }

  
}
