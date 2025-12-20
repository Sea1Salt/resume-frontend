import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteer-box.component.html',
  styleUrls: ['./volunteer-box.component.css'], // ✅ แก้ styleUrl -> styleUrls
})
export class VolunteerBoxComponent implements OnInit {

  // ✅ รับจาก /volunteer-box?activityType=3
  activityType: number = 0;

  // UI state
  isPopupOpen = false;
  isClosing = false;
  showError = false;

  // Form state
  previewImage: string | null = null;
  name = '';
  place = '';
  date: Date = new Date();
  comment = '';
  detail = '';

  // Data state
  volunteers: VolunteerBox[] = [];
  expandedCards: boolean[] = [];
  editIndex: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.readActivityType();
    this.loadLocal();
    this.loadUploadedImage();
  }

  // ----------------------------
  // Params
  // ----------------------------
  private readActivityType(): void {
    this.route.queryParamMap.subscribe(params => {
      this.activityType = Number(params.get('activityType') ?? 0);
      console.log('activityType =', this.activityType); // ควรเป็น 3
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
  // Upload image
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
  // CRUD (ชื่อเหมือนเดิมเพื่อไม่ต้องแก้ HTML)
  // ----------------------------
  saveActivity(): void {
    if (!this.isValidForm()) {
      this.flashError();
      return;
    }

    const newItem: VolunteerBox = {
      Name: this.name.trim(),
      Place: this.place.trim(),
      Date: this.date,
      Comment: this.comment,
      Detail: this.detail,
      Image: this.previewImage || '',
    };

    if (this.editIndex !== null) {
      this.volunteers[this.editIndex] = newItem;
      this.editIndex = null;
    } else {
      this.volunteers.push(newItem);
      this.expandedCards.push(false);
    }

    this.persistLocal();
    this.resetForm();
    this.closePopup();
  }

  deleteActivity(index: number): void {
    this.volunteers.splice(index, 1);
    this.expandedCards.splice(index, 1);
    this.persistLocal();
  }

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
    this.resetForm();
    this.openPopup();
  }

  // ----------------------------
  // LocalStorage
  // ----------------------------
  private loadLocal(): void {
    const storedData = localStorage.getItem('volunteer');
    if (!storedData) return;

    this.volunteers = JSON.parse(storedData);
    this.expandedCards = Array(this.volunteers.length).fill(false);
  }

  private persistLocal(): void {
    localStorage.setItem('volunteer', JSON.stringify(this.volunteers));
    console.log('volunteer', this.volunteers);
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
}
