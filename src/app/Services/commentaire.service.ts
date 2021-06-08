import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Commentaire } from '../Models/commentaire';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  public getCommentByTicket(idTicket : number) : Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiServerUrl}/commentaire/get/ticket/${idTicket}`)
  }

  // Ajouter Un commentaire
  public addComment(commentaire : Commentaire , idTicket : number , idUser : number) : Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiServerUrl}/commentaire/add/${idTicket}/${idUser}` , commentaire);
  }
}
