import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AcademicBox {
  Name: string;
  Place: string;
  Date: Date;
  Comment: string;
  Detail: string;
  Image?: string;
}

@Component({
  selector: 'app-academic-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-box.component.html',
  styleUrls: ['./academic-box.component.css'], // Fixed typo
})
export class AcademicBoxComponent {
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
    this.isClosing = true; // Start closing animation

    // Wait for animation (400ms) before hiding
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

        // Save to localStorage
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
  academics: AcademicBox[] = [];


  saveAcademic(): void {
    if (this.name.trim() !== "" && this.place.trim() !== "" && this.date) {
  
      const newItem: AcademicBox = {
        Name: this.name,
        Place: this.place,
        Date: this.date,
        Comment: this.comment,
        Detail: this.detail,
        Image: this.previewImage || ""
      };
  
      if (this.editIndex !== null) {
        this.academics[this.editIndex] = newItem;
        this.editIndex = null;
      } else {
        this.academics.push(newItem);
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
    localStorage.setItem("academic", JSON.stringify(this.academics))
    console.log('academic', this.academics)
  }


  ngOnInit(): void {
    const storedData = localStorage.getItem('academic');
    if (storedData) {
      this.academics = JSON.parse(storedData);
      this.expandedCards = Array(this.academics.length).fill(false);
    }
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) {
      this.previewImage = storedImage;
    }
  }

  deleteAcademic(index: number): void {
    this.academics.splice(index, 1);
    this.saveLocal();
    this.expandedCards.splice(index, 1);
  }

  expandedCards: boolean[] = [];

  editIndex: number | null = null; // index of the item being edited

  editAcademic(index: number): void {
    const selected = this.academics[index];
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
