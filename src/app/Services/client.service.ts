import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../Models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
  
  public getClients() : Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiServerUrl}/client/list`);
  }
  
  
  public getClient(idClient : number) : Observable<Client> {
    return this.http.get<Client>(`${this.apiServerUrl}/client/${idClient}`);
  }

  
  // Ajouter Un Client
  public addClients(client : Client) : Observable<Client> {
    return this.http.post<Client>(`${this.apiServerUrl}/client/add` , client);
  }


  //Modifier un Client
  public updateClient(idClient : number , client : Client) : Observable<Client> {
    return this.http.put<Client>(`${this.apiServerUrl}/client/update/${idClient}` , client);
  }
}
