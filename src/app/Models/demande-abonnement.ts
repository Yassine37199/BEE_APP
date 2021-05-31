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
}