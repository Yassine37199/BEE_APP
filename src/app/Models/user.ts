import { Role } from "./role";

export interface User {
    idUser : number;
    nom : string;
    prenom : string;
    email : string;
    password : string;
    tel : number;
    active : string;
    role : Role;
}
