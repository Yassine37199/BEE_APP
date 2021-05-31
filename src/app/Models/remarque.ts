import { DemandeAbonnement } from "./demande-abonnement";

export interface Remarque {
    idRemarque : number;
    text : string;
    demandeabonnement : DemandeAbonnement
}