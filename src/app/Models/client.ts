export interface Client {
    idClient : number;
    name : string;
    cin : number;
    email : string;
    ville : string;
    gouvernorat : string;
    adresse : string;
    codePostal : number;
    dateNaissance : Date;
    telephone : number;
    active? : boolean;
    dateCreation : Date;
}