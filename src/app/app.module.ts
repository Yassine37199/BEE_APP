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
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddClientComponent } from './Components/Client/add-client/add-client.component';
import { UpdateClientComponent } from './Components/Client/update-client/update-client.component';
import { AddOffreComponent } from './Components/Offre/add-offre/add-offre.component';
import { UpdateOffreComponent } from './Components/Offre/update-offre/update-offre.component';
import { UpdateUserComponent } from './Components/User/update-user/update-user.component';
import { ListModemsComponent } from './Components/Modem/list-modems/list-modems.component';
import { AddModemsComponent } from './Components/Modem/add-modems/add-modems.component';
import { UpdateModemsComponent } from './Components/Modem/update-modems/update-modems.component';
import { AddPdvComponent } from './Components/Point-Vente/add-pdv/add-pdv.component';
import { UpdatePdvComponent } from './Components/Point-Vente/update-pdv/update-pdv.component';
import { ListDemandesComponent } from './Components/Demande_abonnement/list-demandes/list-demandes.component';
import { AddDemandeComponent } from './Components/Demande_abonnement/add-demande/add-demande.component';
import { AddAbonnementComponent } from './Components/Abonnement/add-abonnement/add-abonnement.component';
import { UpdateAbonnementComponent } from './Components/Abonnement/update-abonnement/update-abonnement.component';
import { UpdateDemandeComponent } from './Components/Demande_abonnement/update-demande/update-demande.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { StatsCardsComponent } from './Components/stats-cards/stats-cards.component';
import { ListRegionComponent } from './Components/Region/list-region/list-region.component';
import { AddRegionComponent } from './Components/Region/add-region/add-region.component';
import { UpdateRegionComponent } from './Components/Region/update-region/update-region.component';
import { ListAgentsTTComponent } from './Components/AgentTT/list-agents-tt/list-agents-tt.component';
import { AddAgentTTComponent } from './Components/AgentTT/add-agent-tt/add-agent-tt.component';
import { UpdateAgentTTComponent } from './Components/AgentTT/update-agent-tt/update-agent-tt.component';
import { ClientDetailsComponent } from './Components/client-details/client-details.component';
import { AbonnementDetailsComponent } from './Components/abonnement-details/abonnement-details.component';
import { AddTicketComponent } from './Components/Ticket/add-ticket/add-ticket.component';
import { UpdateTicketComponent } from './Components/Ticket/update-ticket/update-ticket.component';
import { ProfilComponent } from './Components/profil/profil.component';
import { RepartitionComponent } from './Components/repartition/repartition.component';
import { AddReclamationComponent } from './Components/Reclamation/add-reclamation/add-reclamation.component';
import { UpdateReclamationComponent } from './Components/Reclamation/update-reclamation/update-reclamation.component';
import { HomepageRecouvrementComponent } from './Components/homepage-recouvrement/homepage-recouvrement.component';
import { StatsDmndesComponent } from './Components/stats-dmndes/stats-dmndes.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { ContactFormComponent } from './Components/contact-form/contact-form.component';


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
    AddClientComponent,
    UpdateClientComponent,
    AddOffreComponent,
    UpdateOffreComponent,
    UpdateUserComponent,
    ListModemsComponent,
    AddModemsComponent,
    UpdateModemsComponent,
    AddPdvComponent,
    UpdatePdvComponent,
    ListDemandesComponent,
    AddDemandeComponent,
    AddAbonnementComponent,
    UpdateAbonnementComponent,
    UpdateDemandeComponent,
    HomePageComponent,
    StatsCardsComponent,
    ListRegionComponent,
    AddRegionComponent,
    UpdateRegionComponent,
    ListAgentsTTComponent,
    AddAgentTTComponent,
    UpdateAgentTTComponent,
    ClientDetailsComponent,
    AbonnementDetailsComponent,
    AddTicketComponent,
    UpdateTicketComponent,
    ProfilComponent,
    RepartitionComponent,
    AddReclamationComponent,
    UpdateReclamationComponent,
    HomepageRecouvrementComponent,
    StatsDmndesComponent,
    NavbarComponent,
    ContactFormComponent,
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
