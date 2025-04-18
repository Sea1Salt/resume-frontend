import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface VolunteerBox {
  Name: string;
  Place: string;
  Date: Date;
  Comment: string;
  Detail: string;
  Image?: string;
}

@Component({
  selector: 'app-volunteer-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteer-box.component.html',
  styleUrl: './volunteer-box.component.css'
})
export class VolunteerBoxComponent {
  isPopupOpen = false;
  isClosing = false;
  previewUrl: string | ArrayBuffer | null = null;
  showError: any;
  previewImage: string | null = null;
  openPopup() {
    this.isPopupOpen = true;
    this.isClosing = false;
  }

  closePopup() {
    this.isClosing = true;

    setTimeout(() => {
      this.isPopupOpen = false;
      this.isClosing = false;
    }, 400);
  }


  onImageSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;

        localStorage.setItem('uploadedImage', this.previewImage!);
      };
      reader.readAsDataURL(file); // Converts image to Base64
    }
  }


  name: string = "";
  place: string = "";
  date: Date = new Date();
  comment: string = "";
  detail: string = "";
  volunteers: VolunteerBox[] = [];


  saveActivity(): void {
    if (this.name.trim() !== "" && this.place.trim() !== "" && this.date) {

      const newItem: VolunteerBox = {
        Name: this.name,
        Place: this.place,
        Date: this.date,
        Comment: this.comment,
        Detail: this.detail,
        Image: this.previewImage || ""
      };

      if (this.editIndex !== null) {
        this.volunteers[this.editIndex] = newItem;
        this.editIndex = null;
      } else {
        this.volunteers.push(newItem);
        this.expandedCards.push(false);
      }

      this.name = "";
      this.place = "";
      this.date = new Date();
      this.comment = "";
      this.detail = "";
      this.previewImage = null;
      this.saveLocal();
      this.closePopup(); // Save to localStorage

    } else {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    }
  }


  saveLocal(): void {
    localStorage.setItem("volunteer", JSON.stringify(this.volunteers))
    console.log('volunteer', this.volunteers)
  }


  ngOnInit(): void {
    const storedData = localStorage.getItem('volunteer');
    if (storedData) {
      this.volunteers = JSON.parse(storedData);
      this.expandedCards = Array(this.volunteers.length).fill(false);
    }
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      this.previewImage = storedImage;
    }
  }

  deleteActivity(index: number): void {
    this.volunteers.splice(index, 1);
    this.saveLocal();
    this.expandedCards.splice(index, 1);
  }

  expandedCards: boolean[] = [];

  editIndex: number | null = null; // index of the item being edited

  editActivity(index: number): void {
    const selected = this.volunteers[index];
    this.name = selected.Name;
    this.place = selected.Place;
    this.date = new Date(selected.Date);
    this.comment = selected.Comment;
    this.detail = selected.Detail;
    this.previewImage = selected.Image || null;
    this.editIndex = index;
    this.openPopup();
  }

  clearForm(): void {
    this.name = "";
    this.place = "";
    this.date = new Date();
    this.comment = "";
    this.detail = "";
    this.previewImage = null;
    this.editIndex = null;
    this.openPopup();
  }

}
