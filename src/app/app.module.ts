import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { DataTablesModule } from "angular-datatables";
import {HttpClientModule} from "@angular/common/http";
import { ListUsersComponent } from './Components/User/list-users/list-users.component'
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListOffresComponent } from './Components/Offre/list-offres/list-offres.component';
import { ListClientsComponent } from './Components/Client/list-clients/list-clients.component';
import { ListRolesComponent } from './Components/Role/list-roles/list-roles.component';
import { ListPdvComponent } from './Components/Point-Vente/list-pdv/list-pdv.component';
import { ListAbonnementsComponent } from './Components/Abonnement/list-abonnements/list-abonnements.component';
import { LoginComponent } from './Components/login/login.component';
import { LogoutComponent } from './Components/logout/logout.component';
import { Error404Component } from './Components/error404/error404.component';
import { UnauthorizedComponent } from './Components/unauthorized/unauthorized.component';
import { AddUserComponent } from './Components/User/add-user/add-user.component';
import { AddRoleComponent } from './Components/Role/add-role/add-role.component';
import { UpdateRoleComponent } from './Components/Role/update-role/update-role.component';
import { ToastComponent } from './toast/toast.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddClientComponent } from './Components/Client/add-client/add-client.component';
import { UpdateClientComponent } from './Components/Client/update-client/update-client.component';
import { AddOffreComponent } from './Components/Offre/add-offre/add-offre.component';
import { UpdateOffreComponent } from './Components/Offre/update-offre/update-offre.component';
import { UpdateUserComponent } from './Components/User/update-user/update-user.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ListUsersComponent,
    ListOffresComponent,
    ListClientsComponent,
    ListRolesComponent,
    ListPdvComponent,
    ListAbonnementsComponent,
    LoginComponent,
    LogoutComponent,
    Error404Component,
    UnauthorizedComponent,
    AddUserComponent,
    AddRoleComponent,
    UpdateRoleComponent,
    ToastComponent,
    AddClientComponent,
    UpdateClientComponent,
    AddOffreComponent,
    UpdateOffreComponent,
    UpdateUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
