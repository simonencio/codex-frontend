import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from '../../_interfacce/IRispostaServer.interface';
import { SerieTv } from 'src/app/_type/_Admin/serieTv.type';
import { Film } from 'src/app/_type/_Admin/Film.type';
import { Router } from '@angular/router';
import { Episodi } from 'src/app/_type/_Admin/episodi.type';
import * as bootstrap from 'bootstrap';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import { UtilityService } from 'src/app/_servizi/utility.service';

@Component({
  selector: 'app-film-e-serie',
  templateUrl: './film-e-serie.component.html',
  styleUrls: ['./film-e-serie.component.scss']
})
export class FilmESerieComponent implements OnInit, AfterViewInit {
  elencoSerie$: Observable<IRispostaServer>;
  elencoFilm$: Observable<IRispostaServer>;
  elencoEpisodi$: Observable<IRispostaServer>;
  datiSerie: SerieTv[] = [];
  datiFilm: Film[] = [];
  datiEpisodi: Episodi[] = [];
  private distruggi$ = new Subject<void>();
  currentSerieVideoId: number | null = null;
  currentFilmVideoId: number | null = null;
  groupedSeries: any[][] = [];
  groupedFilms: any[][] = [];
  groupedEpisodi: any[][] = [];
  showPrevButton: boolean = false;
  currentFilm: Film | null = null;
  pathFile: string = UtilityService.storagePath();
  pathSerie: string = "serieTv/";
  pathFilm: string = "Film/";
  pathEpisodi: string = "Episodi/";
  tokenExists: boolean = false; // Add tokenExists property
  selectedEpisodi: Episodi[] = [];
  categories: Categoria[] = []; // Store categories
  selectedCategoryId: number | null = null; // Store selected category ID
  @ViewChild('filmVideo') filmVideo!: ElementRef<HTMLVideoElement>;
  uniqueSeasons: number[] = [];
  filteredEpisodi: Episodi[] = [];
  constructor(private api: ApiService, private router: Router) {
    // Initialize observables for series, films, and episodes
    this.elencoSerie$ = this.api.getSerieTv().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.datiSerie = response.data;
        this.groupedSeries = this.groupImages(this.datiSerie, this.getItemsPerGroup());
      })
    );

    this.elencoFilm$ = this.api.getFilm().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.datiFilm = response.data;
        this.groupedFilms = this.groupImages(this.datiFilm, this.getItemsPerGroup());
      })
    );

    this.elencoEpisodi$ = this.api.getEpisodi().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.datiEpisodi = response.data;
        this.groupedEpisodi = this.groupImages(this.datiEpisodi, this.getItemsPerGroup());
      })
    );

    // Fetch categories
    this.fetchCategories();
  }

  ngOnInit(): void {
    // Check if the token exists in local storage
    this.tokenExists = !!localStorage.getItem('token');

    // If the token does not exist, redirect to the login page
    if (!this.tokenExists) {
      console.error('No token found, redirecting to login...');
      this.router.navigate(['/login']);
      return; // Exit the method if no token
    }

    // Subscribe to the observables to trigger the data fetching
    this.elencoSerie$.subscribe();
    this.elencoFilm$.subscribe();
    this.elencoEpisodi$.subscribe();

    const modalElement = document.getElementById('filmModal');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', () => {
        console.log('Modal is about to be shown, resetting video...');
        this.resetVideo();
      });

      // Listen for the modal close event
      modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal closed, stopping video...');
        this.stopVideo();
      });
    } else {
      console.error('Film modal element not found.');
    }
  }
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('filmModal');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', () => {
        console.log('Modal is about to be shown, resetting video...');
        this.resetVideo();
      });

      // Listen for the modal close event
      modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('Modal closed, stopping video...');
        this.stopVideo();
      });
    } else {
      console.error('Film modal element not found.');
    }
  }

  // Method to stop the video
  stopVideo(): void {
    if (this.filmVideo && this.filmVideo.nativeElement) {
      const video = this.filmVideo.nativeElement;
      console.log('Stopping video:', video.src);
      video.pause(); // Pause the video
      video.currentTime = 0; // Reset the video to the beginning
    } else {
      console.warn('Video element not found or not initialized.');
    }
  }

  // Method to reset the video
  resetVideo(): void {
    if (this.filmVideo && this.filmVideo.nativeElement) {
      const video = this.filmVideo.nativeElement;
      video.currentTime = 0; // Reset the video to the beginning
      video.pause(); // Ensure the video is paused initially
      video.load(); // Reload the video to ensure it displays correctly
    }
  }



  fetchCategories(): void {
    this.api.getCategorie().subscribe(response => {
      this.categories = response.data; // Assuming response.data contains the categories
      console.log(this.categories); // Log the categories to check their structure
    });
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement; // Type assertion
    this.selectedCategoryId = target.value ? +target.value : null; // Convert to number or null
    this.filterContentByCategory();
  }

  filterContentByCategory(): void {
    // Filter TV series
    if (this.selectedCategoryId) {
      this.groupedSeries = this.groupImages(
        this.datiSerie.filter(serie => serie.idCategoria === this.selectedCategoryId),
        this.getItemsPerGroup()
      );
      this.groupedFilms = this.groupImages(
        this.datiFilm.filter(film => film.idCategoria === this.selectedCategoryId),
        this.getItemsPerGroup()
      );
    } else {
      // Reset to all series and films if no category is selected
      this.groupedSeries = this.groupImages(this.datiSerie, this.getItemsPerGroup());
      this.groupedFilms = this.groupImages(this.datiFilm, this.getItemsPerGroup());
    }
  }

  showSerieVideo(id: number): void {
    console.log('Showing series video for ID:', id);
    this.currentSerieVideoId = id;
  }

  showFilmVideo(id: number): void {
    console.log('Showing film video for ID:', id);
    this.currentFilmVideoId = id;
  }

  hideVideo(): void {
    console.log('Hiding video');
    this.currentSerieVideoId = null;
    this.currentFilmVideoId = null;
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

  openFilmModal(film: Film): void {
    this.currentFilm = film;
    const modalElement = document.getElementById('filmModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  openFullscreenEpisodi(episodio: Episodi): void {
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

  openFullscreenFilm(film: Film): void {
    if (!film) {
      console.warn('No film selected for fullscreen playback.');
      return; // Exit if film is null
    }

    // Stop the modal video
    this.stopVideo();

    // Create a new video element for fullscreen
    const videoElement = document.createElement('video');
    const videoPath = this.getFilmPath(film.idFilm, 'film'); // Ensure this returns the path for film.mp4
    videoElement.src = videoPath;
    videoElement.controls = true;
    videoElement.autoplay = true; // Start playing immediately
    videoElement.classList.add('fullscreen-video');
    document.body.appendChild(videoElement);

    // Request fullscreen for the video element
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if ((videoElement as any).webkitRequestFullscreen) { // Safari
      (videoElement as any).webkitRequestFullscreen();
    } else if ((videoElement as any).msRequestFullscreen) { // IE11
      (videoElement as any).msRequestFullscreen();
    }

    // Remove the video element from the DOM when it ends
    videoElement.onended = () => {
      document.body.removeChild(videoElement);
    };

    // Handle exiting fullscreen
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
        group.push({ idSerieTv: null, idFilm: null }); // Fill empty slots with a placeholder
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

  getImagePath(id: number, type: 'serieTv' | 'film'): string {
    const path = type === 'serieTv' ? this.pathSerie : this.pathFilm;
    return `${this.pathFile}${path}V1/ID_${this.formatId(id)}/locandina.jpg`;
  }

  getFilmPath(id: number, type: 'film'): string {
    return `${this.pathFile}${this.pathFilm}V1/ID_${this.formatId(id)}/film.mp4`;
  }

  getVideoPath(id: number, type: 'serieTv' | 'film'): string {
    if (id === null) {
      console.error('ID is null');
      return '';
    }
    const path = type === 'serieTv' ? this.pathSerie : this.pathFilm;
    return `${this.pathFile}${path}V1/ID_${this.formatId(id)}/filmato.mp4`;
  }

  goBackToFilmModal(): void {
    const modalElement = document.getElementById('filmModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        console.warn('Film modal instance not found.');
      }
    } else {
      console.error('Film modal element not found.');
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
  getVideoPathEpisodi(episodio: Episodi): string {
    if (episodio.idSerieTv === null) {
      console.error('idSerieTv is null for episodio:', episodio);
      return '';
    }
    return `${this.pathFile}${this.pathEpisodi}V1/ID_${this.formatId(episodio.idSerieTv)}/episodio${episodio.NumeroEpisodio}.mp4`;
  }

  formatId(id: number): string {
    return id.toString().padStart(5, '0'); // Format ID to be 5 digits
  }
}