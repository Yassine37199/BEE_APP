import { Abonnement } from "./abonnement";

export interface Modem {
    idConfig : number;
    modemSN : string;
    loginConfig : string,
    mdpConfig : string,
    abonnement : Abonnement
} 