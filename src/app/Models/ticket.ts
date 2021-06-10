import { Abonnement } from "./abonnement";

export interface Ticket {
    idTicket : number;
    statut : string;
    sujet : string
    type : string;
    severite : string;
    dateResolution : Date;
    dateCreation : Date;
    dateEscalade : Date;
    statutN2 : string;
    agentN2 : string;
    agentResolution : string;
    abonnement : Abonnement
}