import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../Models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiServerUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }
  
  
  public getRoles() : Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiServerUrl}/roles/list`);
  }

  public getRole(idRole : number) : Observable<Role> {
    return this.http.get<Role>(`${this.apiServerUrl}/roles/${idRole}`);
  }

  public getRoleByNom(nomrole : String) : Observable<Role> {
    return this.http.get<Role>(`${this.apiServerUrl}/roles/nom/${nomrole}`);
  }
  

  public addRole(role : Role) : Observable<Role> {
    return this.http.post<Role>(`${this.apiServerUrl}/roles/add` , role);
  }


  public updateRole(idRole : number , role : Role) : Observable<Role> {
    return this.http.put<Role>(`${this.apiServerUrl}/roles/update/${idRole}` , role);
  }

}
