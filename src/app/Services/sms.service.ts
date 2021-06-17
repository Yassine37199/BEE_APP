import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SMS } from '../Models/Sms';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  // Envoyer Un SMS Client
  public SendSMS(Sms : SMS) : Observable<SMS> {
    return this.http.post<SMS>(`${this.apiServerUrl}/sms/send` , Sms);
  }
}
