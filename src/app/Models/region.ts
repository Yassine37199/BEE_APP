import { AgentTT } from "./agentTT";
import { User } from "./user";

export interface Region {
    idRegion? : number;
    regionName? : string;
    user : User;
    responsableTT : AgentTT
}