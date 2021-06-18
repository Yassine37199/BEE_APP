import { Client } from "./client";
import { Offre } from "./offre";
import { PointVente } from "./point-vente";

export interface DemandeAbonnement {
    idDemandeAbonnement? : number,
    frequencePaiement? : string,
    adresseInstallation? : string;
    ville? : string,
    gouvernorat? : string,
    etat? : string,
    telADSL? : number,
    typeDemande? : string
    idClient? : number,
    idOffre? : number,
    idAgence? : number
    client? : Client,
    agence? : PointVente,
    offre? : Offre
    agentBackOffice? : string,
    active? : boolean

}