import { Ticket } from "./ticket";

export interface Commentaire {
    idCommentaire : number;
    text : string;
    dateCreation : Date;
    ticket : Ticket
}