import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbonnementDetailsComponent } from './Components/abonnement-details/abonnement-details.component';
import { AddAbonnementComponent } from './Components/Abonnement/add-abonnement/add-abonnement.component';
import { ListAbonnementsComponent } from './Components/Abonnement/list-abonnements/list-abonnements.component';
import { UpdateAbonnementComponent } from './Components/Abonnement/update-abonnement/update-abonnement.component';
import { AddAgentTTComponent } from './Components/AgentTT/add-agent-tt/add-agent-tt.component';
import { ListAgentsTTComponent } from './Components/AgentTT/list-agents-tt/list-agents-tt.component';
import { UpdateAgentTTComponent } from './Components/AgentTT/update-agent-tt/update-agent-tt.component';
import { ClientDetailsComponent } from './Components/client-details/client-details.component';
import { AddClientComponent } from './Components/Client/add-client/add-client.component';
import { ListClientsComponent } from './Components/Client/list-clients/list-clients.component';
import { UpdateClientComponent } from './Components/Client/update-client/update-client.component';
import { ContactFormComponent } from './Components/contact-form/contact-form.component';
import { AddDemandeComponent } from './Components/Demande_abonnement/add-demande/add-demande.component';
import { ListDemandesComponent } from './Components/Demande_abonnement/list-demandes/list-demandes.component';
import { UpdateDemandeComponent } from './Components/Demande_abonnement/update-demande/update-demande.component';
import { Error404Component } from './Components/error404/error404.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { HomepageRecouvrementComponent } from './Components/homepage-recouvrement/homepage-recouvrement.component';
import { LoginComponent } from './Components/login/login.component';
import { LogoutComponent } from './Components/logout/logout.component';
import { AddModemsComponent } from './Components/Modem/add-modems/add-modems.component';
import { ListModemsComponent } from './Components/Modem/list-modems/list-modems.component';
import { UpdateModemsComponent } from './Components/Modem/update-modems/update-modems.component';
import { AddOffreComponent } from './Components/Offre/add-offre/add-offre.component';
import { ListOffresComponent } from './Components/Offre/list-offres/list-offres.component';
import { UpdateOffreComponent } from './Components/Offre/update-offre/update-offre.component';
import { AddPdvComponent } from './Components/Point-Vente/add-pdv/add-pdv.component';
import { ListPdvComponent } from './Components/Point-Vente/list-pdv/list-pdv.component';
import { UpdatePdvComponent } from './Components/Point-Vente/update-pdv/update-pdv.component';
import { ProfilComponent } from './Components/profil/profil.component';
import { AddReclamationComponent } from './Components/Reclamation/add-reclamation/add-reclamation.component';
import { UpdateReclamationComponent } from './Components/Reclamation/update-reclamation/update-reclamation.component';
import { AddRegionComponent } from './Components/Region/add-region/add-region.component';
import { ListRegionComponent } from './Components/Region/list-region/list-region.component';
import { UpdateRegionComponent } from './Components/Region/update-region/update-region.component';
import { RepartitionComponent } from './Components/repartition/repartition.component';
import { AddRoleComponent } from './Components/Role/add-role/add-role.component';
import { ListRolesComponent } from './Components/Role/list-roles/list-roles.component';
import { UpdateRoleComponent } from './Components/Role/update-role/update-role.component';
import { AddTicketComponent } from './Components/Ticket/add-ticket/add-ticket.component';
import { UpdateTicketComponent } from './Components/Ticket/update-ticket/update-ticket.component';
import { UnauthorizedComponent } from './Components/unauthorized/unauthorized.component';
import { AddUserComponent } from './Components/User/add-user/add-user.component';
import { ListUsersComponent } from './Components/User/list-users/list-users.component';
import { UpdateUserComponent } from './Components/User/update-user/update-user.component';
import { RolesType } from './Roles.types';
import { AuthGuardService } from './Services/auth-guard.service';


const routes: Routes = [
  {path : '' , redirectTo : '/homepage' , pathMatch : 'full' , data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE , RolesType.AGENT_SUPPORT_TECHNIQUE ,  RolesType.AGENT_SUPPORT_TECHNIQUE_N2]}},
  // Homepage 
  {path : 'homepage' , component : HomePageComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE , RolesType.AGENT_SUPPORT_TECHNIQUE ,  RolesType.AGENT_SUPPORT_TECHNIQUE_N2]}},
  // Tickets 
  {path : 'add-ticket/:idAbonnement' , component : AddTicketComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_SUPPORT_TECHNIQUE ,  RolesType.AGENT_SUPPORT_TECHNIQUE_N2 , RolesType.AGENT_CALLCENTER]}},
  {path : 'update-ticket/:id' , component : UpdateTicketComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN, RolesType.AGENT_SUPPORT_TECHNIQUE ,  RolesType.AGENT_SUPPORT_TECHNIQUE_N2 , RolesType.AGENT_CALLCENTER]}},
  // Client Details
  {path : 'client-details/:critere/:search' , component : ClientDetailsComponent , canActivate:[AuthGuardService]},
  // Users
  {path : 'list-users' , component : ListUsersComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'add-user' , component : AddUserComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'update-user/:id' , component : UpdateUserComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'profil-details' , component :  ProfilComponent , canActivate:[AuthGuardService]},
  // Régions
  {path : 'list-regions' , component : ListRegionComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'add-region' , component : AddRegionComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'update-region/:id' , component : UpdateRegionComponent , canActivate:[AuthGuardService], 
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
  {path : 'add-pdv' , component : AddPdvComponent, canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'update-pdv/:id' , component : UpdatePdvComponent, canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  // Modems
  {path : 'list-mdms' , component : ListModemsComponent, canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'add-modem/:idAbonnement' , component : AddModemsComponent, canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'update-modem/:id' , component : UpdateModemsComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN, RolesType.AGENT_BACKOFFICE]}},
  // Abonnements
  {path : 'list-abonnements', component : ListAbonnementsComponent , canActivate:[AuthGuardService]},
  {path : 'add-abonnement/:id', component : AddAbonnementComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'update-abonnement/:id', component : UpdateAbonnementComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'abonnement-details/:id', component : AbonnementDetailsComponent , canActivate:[AuthGuardService]},
  // Demandes d'abonnements
  {path : 'list-demandes', component : ListDemandesComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'add-demande', component : AddDemandeComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'update-demande/:id', component : UpdateDemandeComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  {path : 'repartition-demande', component : RepartitionComponent , canActivate:[AuthGuardService],
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_BACKOFFICE]}},
  // Agents TT 
  {path : 'list-agents' , component : ListAgentsTTComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_SUPPORT_TECHNIQUE_N2]}},
  {path : 'add-agentTT' , component : AddAgentTTComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'update-agentTT/:id' , component : UpdateAgentTTComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN]}},
  {path : 'contact/:id' , component : ContactFormComponent , canActivate:[AuthGuardService]},
  // Réclamation TT 
  {path : 'add-rec/:idAbonnement' , component : AddReclamationComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_SUPPORT_TECHNIQUE_N2]}},
  {path : 'update-rec/:id' , component : UpdateReclamationComponent , canActivate:[AuthGuardService], 
  data:{roles : [RolesType.ADMIN , RolesType.AGENT_SUPPORT_TECHNIQUE_N2]}},
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
