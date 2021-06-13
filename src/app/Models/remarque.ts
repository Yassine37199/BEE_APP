import { Abonnement } from "./abonnement";
import { DemandeAbonnement } from "./demande-abonnement";

export interface Remarque {
    idRemarque? : number;
    text? : string;
    demandeabonnement? : DemandeAbonnement;
    abonnement : Abonnement;

}