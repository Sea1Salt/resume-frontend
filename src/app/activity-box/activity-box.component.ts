import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ActivityBox {
  Name: string;
  Place: string;
  Date: Date;
  Comment: string;
  Detail: string;
  Image?: string;
}
@Component({
  selector: 'app-activity-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-box.component.html',
  styleUrl: './activity-box.component.css'
})

export class ActivityBoxComponent {

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
  activities: ActivityBox[] = [];


  saveActivity(): void {
    if (this.name.trim() !== "" && this.place.trim() !== "" && this.date) {

      const newItem: ActivityBox = {
        Name: this.name,
        Place: this.place,
        Date: this.date,
        Comment: this.comment,
        Detail: this.detail,
        Image: this.previewImage || ""
      };

      if (this.editIndex !== null) {
        this.activities[this.editIndex] = newItem;
        this.editIndex = null;
      } else {
        this.activities.push(newItem);
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
    localStorage.setItem("activity", JSON.stringify(this.activities))
    console.log('activity', this.activities)
  }


  ngOnInit(): void {
    const storedData = localStorage.getItem('activity');
    if (storedData) {
      this.activities = JSON.parse(storedData);
      this.expandedCards = Array(this.activities.length).fill(false);
    }
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      this.previewImage = storedImage;
    }
  }

  deleteActivity(index: number): void {
    this.activities.splice(index, 1);
    this.saveLocal();
    this.expandedCards.splice(index, 1);
  }

  expandedCards: boolean[] = [];

  editIndex: number | null = null; // index of the item being edited

  editActivity(index: number): void {
    const selected = this.activities[index];
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

