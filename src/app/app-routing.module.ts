import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAbonnementsComponent } from './Components/Abonnement/list-abonnements/list-abonnements.component';
import { AddClientComponent } from './Components/Client/add-client/add-client.component';
import { ListClientsComponent } from './Components/Client/list-clients/list-clients.component';
import { UpdateClientComponent } from './Components/Client/update-client/update-client.component';
import { Error404Component } from './Components/error404/error404.component';
import { LoginComponent } from './Components/login/login.component';
import { LogoutComponent } from './Components/logout/logout.component';
import { AddOffreComponent } from './Components/Offre/add-offre/add-offre.component';
import { ListOffresComponent } from './Components/Offre/list-offres/list-offres.component';
import { UpdateOffreComponent } from './Components/Offre/update-offre/update-offre.component';
import { ListPdvComponent } from './Components/Point-Vente/list-pdv/list-pdv.component';
import { AddRoleComponent } from './Components/Role/add-role/add-role.component';
import { ListRolesComponent } from './Components/Role/list-roles/list-roles.component';
import { UpdateRoleComponent } from './Components/Role/update-role/update-role.component';
import { UnauthorizedComponent } from './Components/unauthorized/unauthorized.component';
import { AddUserComponent } from './Components/User/add-user/add-user.component';
import { ListUsersComponent } from './Components/User/list-users/list-users.component';
import { UpdateUserComponent } from './Components/User/update-user/update-user.component';
import { RolesType } from './Roles.types';
import { AuthGuardService } from './Services/auth-guard.service';

const routes: Routes = [
  {path : '' , redirectTo : '/list-abonnements' , pathMatch : 'full'},
  // Users
  {path : 'list-users' , component : ListUsersComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'add-user' , component : AddUserComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'update-user/:id' , component : UpdateUserComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  // Offres
  {path : 'list-offres' , component : ListOffresComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'add-offre' , component : AddOffreComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'update-offre/:id' , component : UpdateOffreComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  // Clients
  {path : 'list-clients' , component : ListClientsComponent,  canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN, RolesType.AGENT_BACKOFFICE]}},
  {path : 'add-client' , component :  AddClientComponent ,  canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'update-client/:id' , component :  UpdateClientComponent ,  canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  // Roles
  {path : 'list-roles' , component : ListRolesComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'add-role' , component : AddRoleComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'update-role/:id' , component : UpdateRoleComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  // PDV
  {path : 'list-pdv' , component : ListPdvComponent, canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  // Abonnements
  {path : 'list-abonnements', component : ListAbonnementsComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_SUPPORT_TECHNIQUE,RolesType.AGENT_BACKOFFICE]}},
  // Auth
  {path : 'login' , component : LoginComponent},
  {path : 'logout' , component : LogoutComponent , canActivate:[AuthGuardService]},
  // Error 
  {path : 'error404' , component : Error404Component},
  {path : 'unauthorized' , component : UnauthorizedComponent, canActivate:[AuthGuardService]},
  {path : '**' , redirectTo : '/error404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
