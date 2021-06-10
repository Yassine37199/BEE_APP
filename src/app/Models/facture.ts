export interface Facture {
    idFacture : number;
    typeFacture : string;
    telFac : number;
    refTT : string;
    perodicite : number;
    startPeriode : Date;
    endPeriode : Date;
    montant : number;
    email : string;
    suspendu : boolean;
    gsmfac : number;
    agence : string;
}