import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService, TransAcademic } from '../service-api.service';

interface AcademicBox {
  AcademicId?: number;
  ActivityType: number;
  Name: string;
  Place: string;
  Date: string; // ✅ input type="date" ต้องเป็น yyyy-MM-dd
  Comment: string;
  Detail: string;
  Image?: string | null;
}

@Component({
  selector: 'app-academic-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-box.component.html',
  styleUrls: ['./academic-box.component.css'],
})
export class AcademicBoxComponent implements OnInit {
  // query param ?activityType=1
  activityType = 0;

  // UI
  isPopupOpen = false;
  isClosing = false;
  showError = false;
  previewImage: string | null = null;

  // form (date เป็น string ให้เข้ากับ <input type="date">)
  name = '';
  place = '';
  date = ''; // ✅ yyyy-MM-dd
  comment = '';
  detail = '';

  // data
  academics: AcademicBox[] = [];
  expandedCards: boolean[] = [];

  // edit mode
  editAcademicId: number | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    // ✅ อ่าน query param แล้วโหลดข้อมูลตาม activityType
    this.route.queryParams.subscribe((params) => {
      this.activityType = Number(params['activityType'] ?? 0);
      console.log('activityType =', this.activityType);
      this.loadAcademics();
    });
  }

  // -----------------------------
  // Load from Backend
  // -----------------------------
  loadAcademics(): void {
    this.api.getAcademics(this.activityType).subscribe({
      next: (res) => {
        this.academics = (res || []).map((x) => ({
          AcademicId: x.academicId,
          ActivityType: x.activityType,
          Name: x.name,
          Place: x.place,
          Date: this.toDateInputValue(x.date), // ✅ ให้เป็น yyyy-MM-dd
          Comment: x.comment,
          Detail: x.detail,
          Image: x.image ?? null,
        }));
        this.expandedCards = Array(this.academics.length).fill(false);
      },
      error: (err) => {
        console.error('loadAcademics error', err);
      },
    });
  }

  // -----------------------------
  // Popup
  // -----------------------------
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

  // -----------------------------
  // Image
  // -----------------------------
  onImageSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // -----------------------------
  // Save (POST / PUT)
  // -----------------------------
  saveAcademic(): void {
    if (!this.name.trim() || !this.place.trim() || !this.date) {
      this.flashError();
      return;
    }

    let payload: TransAcademic = {
      Id : this.editAcademicId ?? 0,
      academicId: this.editAcademicId ?? 0, // ✅ PUT ต้องมีให้ตรง id ด้วย
      activityType: this.activityType,
      name: this.name,
      place: this.place,
      date: this.date, // ✅ yyyy-MM-dd
      comment: this.comment,
      detail: this.detail,
      image: this.previewImage || '',
    };

    // ✅ UPDATE
    if (this.editAcademicId) {
      this.api.updateAcademic(payload).subscribe({
        next: () => {
          this.closePopup();
          this.resetForm();
          this.loadAcademics();
        },
        error: (err) => console.error('PUT error', err),
      });
      return;
    }

    // ✅ ADD
    this.api.addAcademic(payload).subscribe({
      next: () => {
        this.closePopup();
        this.resetForm();
        this.loadAcademics();
      },
      error: (err) => console.error('POST error', err),
    });
  }

  // -----------------------------
  // Delete
  // -----------------------------
  deleteAcademic(item: AcademicBox): void {
    if (!item.AcademicId) return;
    this.api.deleteAcademic(item.AcademicId).subscribe({
      next: () => this.loadAcademics(),
      error: (err) => console.error('DELETE error', err),
    });
  }

  // -----------------------------
  // Edit
  // -----------------------------
  editAcademic(item: AcademicBox): void {
    this.editAcademicId = item.AcademicId ?? null;

    this.name = item.Name;
    this.place = item.Place;
    this.date = item.Date; // ✅ yyyy-MM-dd อยู่แล้ว
    this.comment = item.Comment;
    this.detail = item.Detail;
    this.previewImage = item.Image ?? null;

    this.openPopup();
  }

  clearForm(): void {
    this.resetForm();
    this.openPopup();
  }

  // -----------------------------
  // Helpers
  // -----------------------------
  private resetForm(): void {
    this.name = '';
    this.place = '';
    this.date = '';
    this.comment = '';
    this.detail = '';
    this.previewImage = null;
    this.editAcademicId = null;
  }

  private flashError(): void {
    this.showError = true;
    setTimeout(() => (this.showError = false), 3000);
  }

  // รองรับทั้ง "2025-12-18" หรือ ISO "2025-12-18T00:00:00Z"
  private toDateInputValue(value: string): string {
    if (!value) return '';
    // ถ้ามี T ให้ตัดเหลือ yyyy-MM-dd
    if (value.includes('T')) return value.split('T')[0];
    return value;
  }
}
