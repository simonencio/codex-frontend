import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../_servizi/api.service';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { IRispostaServer } from '../../_interfacce/IRispostaServer.interface';
import { Film } from 'src/app/_type/_Admin/Film.type';
import { Categoria } from 'src/app/_type/_Admin/categorie.type';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {
  elencoFilm$: Observable<IRispostaServer>;
  datiFilm: Film[] = [];
  filteredDatiFilm: Film[] = []; // Store filtered films
  categories: Categoria[] = []; // Store categories
  selectedCategoryId: number | null = null; // Store selected category ID
  private distruggi$ = new Subject<void>();
  currentFilmVideoId: number | null = null;
  currentFilm: Film | null = null; // Store the currently selected film
  groupedFilms: any[][] = [];
  pathFile: string = "http://localhost/finale/codex/storage/app/public/";
  pathFilm: string = "film/";
  @ViewChild('filmVideo') filmVideo!: ElementRef<HTMLVideoElement>;
  constructor(private api: ApiService) {
    this.elencoFilm$ = this.api.getFilm().pipe(
      takeUntil(this.distruggi$),
      tap(response => {
        this.datiFilm = response.data;
        this.filteredDatiFilm = this.datiFilm; // Initialize filtered films
        this.groupedFilms = this.groupImages(this.filteredDatiFilm, this.getItemsPerGroup());
      })
    );

    // Fetch categories
    this.fetchCategories();
  }

  ngOnInit(): void {
    this.elencoFilm$.subscribe();

    // Listen for the modal open event
    const modalElement = document.getElementById('filmModal');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', () => {
        this.resetVideo();
      });

      // Listen for the modal close event
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.stopVideo();
      });
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

  // Method to stop the video
  stopVideo(): void {
    if (this.filmVideo && this.filmVideo.nativeElement) {
      const video = this.filmVideo.nativeElement;
      video.pause(); // Pause the video
      video.currentTime = 0; // Reset the video to the beginning
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
    this.filterFilmsByCategory();
  }

  filterFilmsByCategory(): void {
    if (this.selectedCategoryId) {
      this.filteredDatiFilm = this.datiFilm.filter(film => film.idCategoria === this.selectedCategoryId);
    } else {
      this.filteredDatiFilm = this.datiFilm; // Reset to all films if no category is selected
    }
    this.groupedFilms = this.groupImages(this.filteredDatiFilm, this.getItemsPerGroup());
  }

  showFilmVideo(id: number): void {
    console.log('Showing film video for ID:', id);
    this.currentFilmVideoId = id;
  }

  hideVideo(): void {
    console.log('Hiding video');
    this.currentFilmVideoId = null;
  }

  openFilmModal(film: Film): void {
    this.currentFilm = film; // Set the current film
    const modalElement = document.getElementById('filmModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  groupImages(array: any[], itemsPerGroup: number): any[][] {
    const result = [];
    const totalGroups = Math.ceil(array.length / itemsPerGroup);
    for (let i = 0; i < totalGroups; i++) {
      const group = array.slice(i * itemsPerGroup, (
        (i + 1) * itemsPerGroup));
      while (group.length < itemsPerGroup) {
        group.push({ idFilm: null }); // Fill empty slots with a placeholder
      }
      result.push(group);
    }
    return result;
  }

  getItemsPerGroup(): number {
    if (window.innerWidth >= 1024) {
      return 4; // 4 items per group for large screens
    } else if (window.innerWidth >= 768) {
      return 3; // 3 items per group for medium screens
    } else {
      return 2; // 2 items per group for small screens
    }
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
  getFilmPath(id: number, type: 'film'): string {
    const path = type === 'film' ? this.pathFilm : this.pathFilm;
    return `${this.pathFile}${path}V1/ID_${this.formatId(id)}/film.mp4`;
  }

  getImagePath(id: number): string {
    return `${this.pathFile}${this.pathFilm}V1/ID_${this.formatId(id)}/locandina.jpg`;
  }

  getVideoPath(id: number): string {
    return `${this.pathFile}${this.pathFilm}V1/ID_${this.formatId(id)}/filmato.mp4`;
  }

  formatId(id: number): string {
    return id.toString().padStart(5, '0'); // Format ID to be 5 digits
  }
}
