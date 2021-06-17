import { Abonnement } from "./abonnement";
import { User } from "./user";

export interface ReclamationTT {
    idReclamation? : number;
    telADSL : number;
    dateReclamation : Date;
    objet : string;
    etat : string;
    dateEtat : Date;
    abonnement? : Abonnement,
    user? : User
}