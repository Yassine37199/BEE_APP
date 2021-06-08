import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email } from '../Models/Email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  // Envoyer Un Mail TT/N2
  public SendMail(email : Email) : Observable<Email> {
    return this.http.post<Email>(`${this.apiServerUrl}/email/send` , email);
  }

}
