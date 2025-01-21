

export type Registrazione = {
    user: string,
    psw: string,
    nome: string,
    cognome: string,
    sesso: number,
    codiceFiscale: string,
    dataNascita: Date,
    cittaNascita: string,
    cittadinanza: string,
    nazione: string,
    citta: string,
    provincia: string,
    cap: number,
    ruolo: string,
    partitaIva: number | null,
    tipologiaIndirizzo: number,
    indirizzo: string,
    civico: number,
    altro: string | null,
}