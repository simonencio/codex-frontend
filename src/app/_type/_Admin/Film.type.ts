
export type Film = {
    idFilm: number,
    idCategoria: number | null,
    titolo: string,
    descrizione: string,
    durata: number | null,
    regista: string,
    attori: string,
    anno: number | null,
    videoFileName?: string;
    locandinaFileName?: string;
    filmFileName?: string;
}