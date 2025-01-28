import { Injectable } from '@angular/core';
import { ChiamataHTTP } from '../_type/chiamataHTTP.type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concatMap, from, map, Observable, of, take, tap, catchError } from 'rxjs';
import { IRispostaServer } from '../_interfacce/IRispostaServer.interface';
import { UtilityService } from './utility.service';
import { SerieTv } from '../_type/_Admin/serieTv.type';
import { AuthService } from './auth.service'; // Import the AuthService
import { Registrazione } from '../_type/registrazione/registrazione.type';
import { Film } from '../_type/_Admin/Film.type';
import { Episodi } from '../_type/_Admin/episodi.type';
import { Indirizzi } from '../_type/_Admin/Indirizzi.type';
import { Profilo } from '../_type/_Admin/profilo.type';
import { Categoria } from '../_type/_Admin/categorie.type';
import { TipologieIndirizzi } from '../_type/_Admin/tipologieIndirizzi.type';
import { tipoRecapito } from '../_type/registrazione/tipoRecapito.type';
import { Credito } from '../_type/_Admin/crediti.type';
import { Recapito } from '../_type/_Admin/recapiti.type';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  //------------------------------------------------------------------------------------------------

  protected calcolaRisorsa(risorsa: (string | number)[]): string {
    const server: string = "/api/codex/public/api"; // Adjust your server URL
    const versione: string = "v1";
    let url = server + "/" + versione + "/";
    url = url + risorsa.join("/");
    return url;
  }

  protected richiestaGenerica(risorsa: (string | number)[], tipo: ChiamataHTTP, parametri: Object | null = null): Observable<IRispostaServer> {
    const url = this.calcolaRisorsa(risorsa);

    // Get the token from AuthService
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    // If the token exists, add it to the headers
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    switch (tipo) {
      case "GET":
        return this.http.get<IRispostaServer>(url, { headers }).pipe(
          catchError(err => this.handleError(err))
        );
      case "POST":
        if (parametri !== null) {
          return this.http.post<IRispostaServer>(url, parametri, { headers }).pipe(
            catchError(err => this.handleError(err))
          );
        } else {
          return of({ data: null, message: null, error: "NO_PARAMETRI" });
        }
      case "PUT":
        if (parametri !== null) {
          return this.http.put<IRispostaServer>(url, parametri, { headers }).pipe(
            catchError(err => this.handleError(err))
          );
        } else {
          return of({ data: null, message: null, error: "NO_PARAMETRI" });
        }
      case "DELETE":
        return this.http.delete<IRispostaServer>(url, { headers }).pipe(
          catchError(err => this.handleError(err))
        );
      default:
        return this.http.get<IRispostaServer>(url, { headers }).pipe(
          catchError(err => this.handleError(err))
        );
    }
  }

  private handleError(err: any): Observable<IRispostaServer> {
    // Handle the error and return a default response
    console.error('An error occurred:', err);
    return of({ data: null, message: null, error: "UNKNOWN_ERROR" });
  }


  //-------- FUNZIONI DI RICHIAMO --------------------------------------------------------
  public getContatto(): Observable<IRispostaServer> {
    const risorsa: string[] = ["contatti"]; // Adjust the endpoint as necessary
    return this.richiestaGenerica(risorsa, "GET");
  }
  public getCittadinanze(): Observable<IRispostaServer> {
    const risorsa: string[] = ["cittadinanze"]; // Adjust the endpoint as necessary
    return this.richiestaGenerica(risorsa, "GET");
  }
  public getCategorie(): Observable<IRispostaServer> {
    const risorsa: string[] = ["categorie"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postCategorie(parametri: Partial<Categoria>): Observable<IRispostaServer> {
    const risorsa: string[] = ["categorie"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putCategorie(id: number, parametri: Partial<Categoria>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["categorie", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteCategorie(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["categorie", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }



  public getTipoRecapito(): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipirecapiti"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postTipoRecapito(parametri: Partial<tipoRecapito>): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipirecapiti"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putTipoRecapito(id: number, parametri: Partial<tipoRecapito>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["tipirecapiti", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteTipoRecapito(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipirecapiti", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }

  public getCredito(): Observable<IRispostaServer> {
    const risorsa: string[] = ["crediti"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postCredito(parametri: Partial<Credito>): Observable<IRispostaServer> {
    const risorsa: string[] = ["crediti"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putCredito(id: number, parametri: Partial<Credito>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["crediti", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteCredito(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["crediti", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }


  public getRecapiti(): Observable<IRispostaServer> {
    const risorsa: string[] = ["recapiti"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postRecapiti(parametri: Partial<Recapito>): Observable<IRispostaServer> {
    const risorsa: string[] = ["recapiti"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putRecapiti(id: number, parametri: Partial<Recapito>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["recapiti", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteRecapiti(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["recapiti", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }




  public getProfilo(): Observable<IRispostaServer> {
    const risorsa: string[] = ["profili"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postProfilo(parametri: Partial<Profilo>): Observable<IRispostaServer> {
    const risorsa: string[] = ["profili"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putProfilo(id: number, parametri: Partial<Profilo>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["profili", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteProfilo(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["profili", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }





  public getTipologieIndirizzi(): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipologiaIndirizzi"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postTipologieIndirizzi(parametri: Partial<TipologieIndirizzi>): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipologiaIndirizzi"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putTipologieIndirizzi(id: number, parametri: Partial<TipologieIndirizzi>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["tipologiaIndirizzi", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteTipologieIndirizzi(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipologiaIndirizzi", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }
  public getIndirizzi(): Observable<IRispostaServer> {
    const risorsa: string[] = ["indirizzi"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postIndirizzi(parametri: Partial<Indirizzi>): Observable<IRispostaServer> {
    const risorsa: string[] = ["indirizzi"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putIndirizzi(id: number, parametri: Partial<Indirizzi>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["indirizzi", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteIndirizzi(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["indirizzi", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }
  public getSerieTvSingola(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["serietv", id];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public getNazioni(): Observable<IRispostaServer> {
    const risorsa: string[] = ["nazioni"]; // Adjust the endpoint as necessary
    return this.richiestaGenerica(risorsa, "GET");
  }

  public getComuni(): Observable<IRispostaServer> {
    const risorsa: string[] = ["comuni"]; // Adjust the endpoint as necessary
    return this.richiestaGenerica(risorsa, "GET");
  }
  public getTipologiaIndirizzo(): Observable<IRispostaServer> {
    const risorsa: string[] = ["tipologiaIndirizzi"]; // Adjust the endpoint as necessary
    return this.richiestaGenerica(risorsa, "GET");
  }


  public hashUser(user: string): Observable<IRispostaServer> {
    const risorsa: string[] = ['cifra']; // Adjust the endpoint as necessary
    return this.richiestaGenerica(risorsa, 'POST', { nome: user });
  }

  // New method to hash the password
  public hashPassword(password: string): Observable<IRispostaServer> {
    const risorsa: string[] = ['cifraPsw']; // Adjust the endpoint as necessary
    return this.richiestaGenerica(risorsa, 'POST', { psw: password });
  }

  public getSerieTv(): Observable<IRispostaServer> {
    const risorsa: string[] = ["serietv"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postSerieTv(parametri: Partial<SerieTv>): Observable<IRispostaServer> {
    const risorsa: string[] = ["serietv"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putSerieTv(id: number, parametri: Partial<SerieTv>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["serietv", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteSerieTv(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["serietv", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }


  public getFilm(): Observable<IRispostaServer> {
    const risorsa: string[] = ["film"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postFilm(parametri: Partial<Film>): Observable<IRispostaServer> {
    const risorsa: string[] = ["film"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }


  public putFilm(id: number, parametri: Partial<Film>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["film", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }

  public deleteFilm(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["film", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }
  public getEpisodi(): Observable<IRispostaServer> {
    const risorsa: string[] = ["episodi"];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postEpisodi(parametri: Partial<Episodi>): Observable<IRispostaServer> {
    const risorsa: string[] = ["episodi"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public putEpisodi(id: number, parametri: Partial<Episodi>): Observable<IRispostaServer> {
    const risorsa: [string, number] = ["episodi", id];
    return this.richiestaGenerica(risorsa, "PUT", parametri);
  }
  public deleteEpisodi(id: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["episodi", id];
    return this.richiestaGenerica(risorsa, "DELETE");
  }







  public getLoginFase1(hashUtente: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["accedi", hashUtente];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public postRegistrazione(parametri: Partial<Registrazione>): Observable<IRispostaServer> {
    const risorsa: string[] = ["registrazione"];
    return this.richiestaGenerica(risorsa, "POST", parametri);
  }
  public getLoginFase2(hashUtente: string, hashPassword: string): Observable<IRispostaServer> {
    const risorsa: string[] = ["accedi", hashUtente, hashPassword];
    return this.richiestaGenerica(risorsa, "GET");
  }
  public uploadFilm(dati: FormData): Observable<IRispostaServer> {
    const risorsa: string[] = ["uploadFilm"];
    return this.richiestaGenerica(risorsa, "POST", dati);
  }
  public uploadSerieTv(dati: FormData): Observable<IRispostaServer> {
    const risorsa: string[] = ["uploadSerieTv"];
    return this.richiestaGenerica(risorsa, "POST", dati);
  }
  public uploadEpisodi(dati: FormData): Observable<IRispostaServer> {
    const risorsa: string[] = ["uploadEpisodi"];
    return this.richiestaGenerica(risorsa, "POST", dati);
  }

  public login(utente: string, password: string): Observable<IRispostaServer> {
    const hashUtente: string = UtilityService.hash(utente);
    const hashPassword: string = UtilityService.hash(password);
    const controllo$ = this.getLoginFase1(hashUtente).pipe(
      take(1),
      tap(x => console.log("dati: ", x)),
      map((rit: IRispostaServer): string => {
        const sale: string = rit.data.sale;
        const passwordNascosta = UtilityService.nascondiPassword(hashPassword, sale);
        return passwordNascosta;
      }),
      concatMap((rit: string) => {
        return this.getLoginFase2(hashUtente, rit);
      }),
      tap((response: IRispostaServer) => {
        // Assuming response.data contains idContatto
        if (response.data && response.data.idContatto) {
          // Store idContatto in local storage
          localStorage.setItem('idContatto', response.data.idContatto.toString());
        }
      })
    );
    return controllo$;
  }
}