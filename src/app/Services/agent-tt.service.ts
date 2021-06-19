import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AgentTT } from '../Models/agentTT';

@Injectable({
  providedIn: 'root'
})
export class AgentTTService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  public getAgentsTT() : Observable<AgentTT[]> {
    return this.http.get<AgentTT[]>(`${this.apiServerUrl}/agentTT/get/all`);
  }

  
  public findAgentByEmail(email : string) : Observable<AgentTT> {
    return this.http.get<AgentTT>(`${this.apiServerUrl}/agentTT/email/${email}`);
  }
  
  
  public getAgentTT(idAgentTT : number) : Observable<AgentTT> {
    return this.http.get<AgentTT>(`${this.apiServerUrl}/agentTT/get/${idAgentTT}`);
  }

  
  // Ajouter Un Agent TT
  public addAgentTT(agentTT : AgentTT) : Observable<AgentTT> {
    return this.http.post<AgentTT>(`${this.apiServerUrl}/agentTT/add` , agentTT);
  }


  // Modifier un Agent TT
  public updateAgentTT(idAgentTT : number , agentTT : AgentTT) : Observable<AgentTT> {
    return this.http.put<AgentTT>(`${this.apiServerUrl}/agentTT/update/${idAgentTT}` , agentTT);
  }
}
