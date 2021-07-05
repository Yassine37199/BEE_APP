import { DemandeAbonnement } from "./demande-abonnement";

export interface Abonnement {
    idAbonnement : number;
    refTT : string;
    etatTT : string;
    agenceLivraison : string;
    demandeAbonnement : DemandeAbonnement
    active? : boolean;
    dateCreation? : Date;
}