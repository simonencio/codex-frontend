import { Injectable } from "@angular/core";
import { sha512 } from "js-sha512";
import { jwtDecode } from "jwt-decode";


@Injectable({ providedIn: 'root' })
export class UtilityService {

    static storagePath(): string {
        return "https://www.dominionuovo.cloud/api/codex/storage/app/public/"
    }

    /**
     *  FUNZIONE CHE LEGGE I DATI DAL TOKEN 
     * 
     * @param token Stringa che rappresenta il token 
     * @returns Ritorna un oggetto
     */

    static leggiToken(token: string): any {
        try {
            return jwtDecode(token)
        } catch (Error) {
            console.log("ERRORE di lettura nel token")
            return null
        }
    }
    /**
     * FUNZIONE CHE CREA L'HASH sha512 DI UNA STRINGA  
     * @param str Stringa da cifrare
     * @returns Ritorna stringa Cifrata
     */
    static hash(str: string): string {
        const tmp = sha512(str)
        return tmp
    }

    /**
     * Funzione che calcola l'HASH sha512 della password legata al sale
     * 
     * @param password Stringa che rappresenta la password
     * @param sale Stringa che rappresenta un'altra stringa da legare alla password
     * @returns Stringa che rappresenta l'HASH sha512 della password unita al sale
     */
    static nascondiPassword(password: string, sale: string): string {
        const tmp: string = sale + password
        const hash: string = sha512(tmp)
        return hash
    }
}

