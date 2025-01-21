

export type SerieTv = {
    idSerieTv: number,
    idCategoria: number | null,
    nome: string,
    descrizione: string,
    totaleStagioni: number | null,
    NumeroEpisodi: number | null,
    regista: string,
    attori: string,
    annoInizio: number | null,
    annoFine: number | null,
    videoFileName?: string; // Optional property for video file name
    locandinaFileName?: string;

}