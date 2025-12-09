import { Usuario } from "./usuarios";

export interface LoginResponse {
    message: string;    
    access_token: string;    
    token_type: string;    
    user: Usuario; 
}