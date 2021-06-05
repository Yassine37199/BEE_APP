import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ticket } from '../Models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

 private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }


  public getTickets() : Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiServerUrl}/ticket/get/all`);
  }
  
  
  public getTicket(idTicket : number) : Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiServerUrl}/ticket/get/${idTicket}`);
  }

  public getTicketsByDemande(idAbonnement : number) : Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiServerUrl}/ticket/get/abonnement/${idAbonnement}`);
  }

  public getTicketsByUser(idUser : number) : Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiServerUrl}/ticket/get/user/${idUser}`);
  }

  // Ajouter Une Ticket
  public addTicket(ticket : Ticket , idAbonnement : number) : Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiServerUrl}/ticket/add/14/${idAbonnement}` , ticket);
  }


  // Modifier une Ticket
  public updateTicket(idTicket : number , ticket : Ticket) : Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiServerUrl}/ticket/update/${idTicket}` , ticket);
  }
}
