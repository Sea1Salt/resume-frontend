import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-academic-box',
  imports: [CommonModule],
  templateUrl: './academic-box.component.html',
  styleUrls: ['./academic-box.component.css'], // Fixed typo
})
export class AcademicBoxComponent {
  isPopupOpen = false;
  isClosing = false;
  previewUrl: string | ArrayBuffer | null = null;

  openPopup() {
    this.isPopupOpen = true;
    this.isClosing = false;
  }

  closePopup() {
    this.isClosing = true; // Start closing animation

    // Wait for animation (400ms) before hiding
    setTimeout(() => {
      this.isPopupOpen = false;
      this.isClosing = false;
    }, 400);
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
