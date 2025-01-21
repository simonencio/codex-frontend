import { Component, Input } from '@angular/core';
import { Episodi } from 'src/app/_type/_Admin/episodi.type'; // Import your Episodi type

@Component({
  selector: 'app-episodi-modal',
  templateUrl: './episodi-modal.component.html',
  styleUrls: ['./episodi-modal.component.scss']
})
export class EpisodModalComponent {
  @Input() selectedEpisodi: Episodi[] = []; // Input property to receive episodes

  constructor() { }

  openFullscreen(episodio: Episodi): void {
    const videoElement = document.createElement('video');
    const videoPath = this.getVideoPathEpisodi(episodio); // Construct the video path
    videoElement.src = videoPath;
    videoElement.controls = true; // Show controls
    videoElement.autoplay = true; // Start playing automatically

    // Add class for fullscreen styling
    videoElement.classList.add('fullscreen-video');

    // Append the video element to the body
    document.body.appendChild(videoElement);

    // Request fullscreen
    if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    }

    // Remove the video element when it ends
    videoElement.onended = () => {
      document.body.removeChild(videoElement);
    };

    // Remove the video element when exiting fullscreen
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        document.body.removeChild(videoElement);
      }
    });
  }

  getVideoPathEpisodi(episodio: Episodi): string {
    // Check if idSerieTv is not null
    if (episodio.idSerieTv === null) {
      console.error('idSerieTv is null for episodio:', episodio);
      return ''; // Return an empty string or handle the error as needed
    }

    return `http://localhost/finale/codex/public/storage/Episodi/V1/ID_${this.formatId(episodio.idSerieTv)}/episodio${episodio.NumeroEpisodio}.mp4`;
  }

  formatId(id: number): string {
    let formattedId;

    if (id < 10) {
      formattedId = '0000' + id;
    } else if (id < 100) {
      formattedId = '000' + id;
    } else if (id < 1000) {
      formattedId = '00' + id;
    } else if (id < 10000) {
      formattedId = '0' + id;
    } else {
      formattedId = id.toString();
    }

    return formattedId;
  }
}