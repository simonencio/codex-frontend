import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from '../../_interfacce/IRispostaServer.interface';
import { SerieTv } from 'src/app/_type/_Admin/serieTv.type';
import { Episodi } from 'src/app/_type/_Admin/episodi.type';
import * as bootstrap from 'bootstrap';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import { UtilityService } from 'src/app/_servizi/utility.service';

@Component({
  selector: 'app-serie-tv',
  templateUrl: './serie-tv.component.html',
  styleUrls: ['./serie-tv.component.scss']
})
export class SerieTvComponent implements OnInit {
  elencoSerie$: Observable<IRispostaServer>;
  elencoEpisodi$: Observable<IRispostaServer>;
  datiSerie: SerieTv[] = [];
  datiEpisodi: Episodi[] = [];
  private distruggi$ = new Subject<void>();
  currentSerieVideoId: number | null = null;
  currentEpisodio: Episodi | null = null; // Store the currently selected episode
  selectedEpisodi: Episodi[] = []; // Store selected episodes
  groupedSeries: any[][] = [];
  filteredDatiSerie: SerieTv[] = []; // Store filtered series
  categories: Categoria[] = []; // Store categories
  selectedCategoryId: number | null = null; // Store selected category ID
  pathFile: string = UtilityService.storagePath();
  pathSerie: string = "serieTv/";
  pathEpisodi: string = "Episodi/";
  uniqueSeasons: number[] = [];
  filteredEpisodi: Episodi[] = [];
  constructor(private api: ApiService) {
    this.elencoSerie$ = this.api.getSerieTv().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.datiSerie = response.data;
        this.filteredDatiSerie = this.datiSerie; // Initialize filtered series
        this.groupedSeries = this.groupImages(this.filteredDatiSerie, this.getItemsPerGroup());
      })
    );

    this.elencoEpisodi$ = this.api.getEpisodi().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.datiEpisodi = response.data;
      })
    );

    // Fetch categories
    this.fetchCategories();
  }

  ngOnInit(): void {
    this.elencoSerie$.subscribe();
    this.elencoEpisodi$.subscribe();
  }

  fetchCategories(): void {
    this.api.getCategorie().subscribe(response => {
      this.categories = response.data; // Assuming response.data contains the categories
      console.log(this.categories); // Log the categories to check their structure
    });
  }
  goBackToEpisodesModal(): void {
    const modalElement = document.getElementById('episodesModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        console.warn('Episodes modal instance not found.');
      }
    } else {
      console.error('Episodes modal element not found.');
    }
  }
  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Type assertion
    this.selectedCategoryId = target.value ? +target.value : null; // Convert to number or null
    this.filterSeriesByCategory();
  }

  filterSeriesByCategory(): void {
    if (this.selectedCategoryId) {
      this.filteredDatiSerie = this.datiSerie.filter(serie => serie.idCategoria === this.selectedCategoryId);
    } else {
      this.filteredDatiSerie = this.datiSerie; // Reset to all series if no category is selected
    }
    this.groupedSeries = this.groupImages(this.filteredDatiSerie, this.getItemsPerGroup());
  }

  showSerieVideo(id: number): void {
    console.log('Showing series video for ID:', id);
    this.currentSerieVideoId = id;
  }

  hideVideo(): void {
    console.log('Hiding video');
    this.currentSerieVideoId = null;
  }

  openEpisodesModal(serie: SerieTv): void {
    this.selectedEpisodi = this.datiEpisodi.filter(episodio => episodio.idSerieTv === serie.idSerieTv);

    // Generate an array of seasons from 1 to totaleStagioni
    const totalSeasons = serie.totaleStagioni || 0; // Default to 0 if null
    this.uniqueSeasons = Array.from({ length: totalSeasons }, (_, i) => i + 1); // Create an array [1, 2, ..., totalSeasons]

    this.filteredEpisodi = this.selectedEpisodi; // Initialize filtered episodes

    const modalElement = document.getElementById('episodesModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  onSeasonChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedSeason = target.value ? +target.value : null; // Convert to number or null

    if (selectedSeason) {
      this.filteredEpisodi = this.selectedEpisodi.filter(episodio => episodio.numeroStagione === selectedSeason);
    } else {
      this.filteredEpisodi = this.selectedEpisodi; // Reset to all episodes if no season is selected
    }
  }
  openFullscreenEpisodi(episodio: Episodi): void {
    this.currentEpisodio = episodio; // Set the current episode
    const videoElement = document.createElement('video');
    const videoPath = this.getVideoPathEpisodi(episodio);
    videoElement.src = videoPath;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.classList.add('fullscreen-video');
    document.body.appendChild(videoElement);

    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    }

    videoElement.onended = () => {
      document.body.removeChild(videoElement);
    };
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        document.body.removeChild(videoElement);
      }
    });
  }

  groupImages(array: any[], itemsPerGroup: number): any[][] {
    const result = [];
    const totalGroups = Math.ceil(array.length / itemsPerGroup);
    for (let i = 0; i < totalGroups; i++) {
      const group = array.slice(i * itemsPerGroup, (i + 1) * itemsPerGroup);
      while (group.length < itemsPerGroup) {
        group.push({ idSerieTv: null });
      }
      result.push(group);
    }
    return result;
  }

  getItemsPerGroup(): number {
    if (window.innerWidth >= 1024) {
      return 4;
    } else if (window.innerWidth >= 768) {
      return 3;
    } else {
      return 2;
    }
  }

  getImagePath(id: number): string {
    return `${this.pathFile}${this.pathSerie}V1/ID_${this.formatId(id)}/locandina.jpg`;
  }

  getVideoPath(id: number): string {
    return `${this.pathFile}${this.pathSerie}V1/ID_${this.formatId(id)}/filmato.mp4`;
  }

  getVideoPathEpisodi(episodio: Episodi): string {
    if (episodio.idSerieTv === null) {
      console.error('idSerieTv is null for episodio:', episodio);
      return '';
    }
    return `${this.pathFile}${this.pathEpisodi}V1/ID_${this.formatId(episodio.idSerieTv)}/episodio${episodio.NumeroEpisodio}.mp4`;
  }

  formatId(id: number): string {
    return id.toString().padStart(5, '0');
  }
}