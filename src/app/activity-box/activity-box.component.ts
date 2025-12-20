import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-box.component.html',
  styleUrls: ['./activity-box.component.css'],
})
export class ActivityBoxComponent implements OnInit {

  // ✅ รับค่าจาก URL: /activity-box?activityType=2
  activityType = 0;

  // UI state
  isPopupOpen = false;
  isClosing = false;
  showError = false;

  // Form state
  name = '';
  place = '';
  date: Date = new Date();
  comment = '';
  detail = '';
  previewImage: string | null = null;

  // Data
  activities: ActivityBox[] = [];
  expandedCards: boolean[] = [];
  editIndex: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.readActivityType();
    this.loadLocal();
    this.loadUploadedImage();
  }

  // ----------------------------
  // Routing / Params
  // ----------------------------
  private readActivityType(): void {
    this.route.queryParamMap.subscribe(params => {
      this.activityType = Number(params.get('activityType') ?? 0);
      console.log('activityType =', this.activityType);
    });
  }

  // ----------------------------
  // Popup
  // ----------------------------
  openPopup(): void {
    this.isPopupOpen = true;
    this.isClosing = false;
  }

  closePopup(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.isPopupOpen = false;
      this.isClosing = false;
    }, 400);
  }

  // ----------------------------
  // Image Upload
  // ----------------------------
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      localStorage.setItem('uploadedImage', this.previewImage);
    };
    reader.readAsDataURL(file);
  }

  private loadUploadedImage(): void {
    const storedImage = localStorage.getItem('uploadedImage');
    if (storedImage) this.previewImage = storedImage;
  }

  // ----------------------------
  // CRUD (LocalStorage)
  // ----------------------------
  saveActivity(): void {
    if (!this.isValidForm()) {
      this.flashError();
      return;
    }

    const newItem: ActivityBox = {
      Name: this.name.trim(),
      Place: this.place.trim(),
      Date: this.date,
      Comment: this.comment,
      Detail: this.detail,
      Image: this.previewImage || '',
    };

    if (this.editIndex !== null) {
      this.activities[this.editIndex] = newItem;
      this.editIndex = null;
    } else {
      this.activities.push(newItem);
      this.expandedCards.push(false);
    }

    this.persistLocal();
    this.resetForm();
    this.closePopup();
  }

  deleteActivity(index: number): void {
    this.activities.splice(index, 1);
    this.expandedCards.splice(index, 1);
    this.persistLocal();
  }

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
    this.resetForm();
    this.openPopup();
  }

  // ----------------------------
  // Helpers
  // ----------------------------
  private isValidForm(): boolean {
    return this.name.trim() !== '' && this.place.trim() !== '' && !!this.date;
  }

  private flashError(): void {
    this.showError = true;
    setTimeout(() => (this.showError = false), 3000);
  }

  private resetForm(): void {
    this.name = '';
    this.place = '';
    this.date = new Date();
    this.comment = '';
    this.detail = '';
    this.previewImage = null;
    this.editIndex = null;
  }

  private loadLocal(): void {
    const storedData = localStorage.getItem('activity');
    if (!storedData) return;

    this.activities = JSON.parse(storedData);
    this.expandedCards = Array(this.activities.length).fill(false);
  }

  private persistLocal(): void {
    localStorage.setItem('activity', JSON.stringify(this.activities));
    console.log('activity', this.activities);
  }
}
