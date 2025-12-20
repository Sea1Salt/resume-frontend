import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service-api.service';

interface AcademicBox {
  AcademicId?: number; // ⭐ สำคัญ (ใช้ update/delete)
  Name: string;
  Place: string;
  Date: Date;
  Comment: string;
  Detail: string;
  Image?: string;
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

  // form
  name = '';
  place = '';
  date: Date = new Date();
  comment = '';
  detail = '';

  // data
  academics: AcademicBox[] = [];
  expandedCards: boolean[] = [];
  editIndex: number | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.activityType = Number(params['activityType'] ?? 0);
      console.log('activityType =', this.activityType);
    });

    this.loadAcademics();
  }

  // -----------------------------
  // Load from Backend
  // -----------------------------
  loadAcademics(): void {
    this.api.getAcademics().subscribe({
      next: (res: any[]) => {
        this.academics = res.map((x) => ({
          AcademicId: x.academicId,
          Name: x.name,
          Place: x.place,
          Date: new Date(x.date),
          Comment: x.comment,
          Detail: x.detail,
          Image: x.image,
        }));
        this.expandedCards = Array(this.academics.length).fill(false);
      },
      error: (err) => console.error('loadAcademics error', err),
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
    const file = event.target.files[0];
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

    const payload = {
      name: this.name,
      place: this.place,
      date: this.date.toISOString().slice(0, 10),
      comment: this.comment,
      detail: this.detail,
      image: this.previewImage || '',
    };

    // UPDATE
    if (this.editIndex !== null) {
      const id = this.academics[this.editIndex].AcademicId!;
      this.api.updateAcademic(id, payload).subscribe(() => {
        this.afterSave();
      });
    }
    // CREATE
    else {
      this.api.addAcademic(payload).subscribe(() => {
        this.afterSave();
      });
    }
  }

  private afterSave(): void {
    this.loadAcademics();
    this.resetForm();
    this.closePopup();
  }

  // -----------------------------
  // Delete
  // -----------------------------
  deleteAcademic(index: number): void {
    const id = this.academics[index].AcademicId!;
    this.api.deleteAcademic(id).subscribe(() => {
      this.loadAcademics();
    });
  }

  // -----------------------------
  // Edit
  // -----------------------------
  editAcademic(index: number): void {
    const item = this.academics[index];

    this.name = item.Name;
    this.place = item.Place;
    this.date = new Date(item.Date);
    this.comment = item.Comment;
    this.detail = item.Detail;
    this.previewImage = item.Image || null;

    this.editIndex = index;
    this.openPopup();
  }

  clearForm(): void {
    this.resetForm();
    this.openPopup();
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

  private flashError(): void {
    this.showError = true;
    setTimeout(() => (this.showError = false), 3000);
  }
}
