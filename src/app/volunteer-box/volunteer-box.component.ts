import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service-api.service';

interface AcademicBox {
  Id?: number;
  AcademicId?: number;
  Name: string;
  Place: string;
  Date: Date;
  Comment: string;
  Detail: string;
  Image?: string;
  ActivityType?: number;
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
  activityType = 3;

  // data
  volunteers: AcademicBox[] = [];
  expandedCards: boolean[] = [];

  // edit mode
  editAcademicId: number | null = null;

  isPopupOpen = false;
  isClosing = false;
  showError = false;

  // form
  name = '';
  place = '';
  date = ''; // ✅ ใช้ string สำหรับ <input type="date">
  comment = '';
  detail = '';
  previewImage: string | null = null;

  constructor(private api: ApiService) {}
  
    ngOnInit(): void {
      this.loadActivities();
    }
  
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
    // GET (โหลดจาก backend แล้วกรอง activityType = 2)
    // -----------------------------
    loadActivities(): void {
      this.api.getAcademics(this.activityType).subscribe({
        next: (res: any[]) => {
          // ✅ map + filter ให้เหลือ activityType = 2
          const mapped = res.map((x) => ({
            AcademicId: x.academicId,
            Name: x.name,
            Place: x.place,
            Date: new Date(x.date),
            Comment: x.comment,
            Detail: x.detail,
            Image: x.image,
            ActivityType: x.activityType,
          }));
  
          this.volunteers = mapped.filter((x) => (x.ActivityType ?? 0) === 3);
          this.expandedCards = Array(this.volunteers.length).fill(false);
        },
        error: (err: any) => console.error('loadActivities error', err),
      });
    }
  
    // -----------------------------
    // Image
    // -----------------------------
    onImageSelected(event: any): void {
      const file = event?.target?.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  
    // -----------------------------
    // POST / PUT
    // -----------------------------
    saveActivity(): void {
      // ✅ กัน date ว่าง / format ไม่ถูก
      const dateToSend =
        this.date && this.date.length >= 10
          ? this.date
          : new Date().toISOString().split('T')[0];
  
      const payload = {
        Id: this.editAcademicId ?? 0,
        academicId: this.editAcademicId ?? 0, // ✅ ต้องมีตอน PUT
        name: this.name,
        place: this.place,
        date: dateToSend, // ✅ yyyy-MM-dd
        comment: this.comment,
        detail: this.detail,
        image: this.previewImage || '',
        activityType: 2, // ✅ หน้านี้ fix เป็น 2
      };
  
      if (this.editAcademicId) {
        // ✅ UPDATE (PUT)
        this.api.updateAcademic(payload).subscribe({
          next: () => {
            this.editAcademicId = null;
            this.openPopup();
            this.resetForm();
            this.loadActivities();
            this.closePopup();
          },
          error: (err: any) => console.error('PUT error', err),
        });
      } else {
        // ✅ ADD (POST)
        this.api.addAcademic(payload).subscribe({
          next: () => {
            this.resetForm();
            this.loadActivities();
            this.closePopup();
            
          },
          error: (err: any) => console.error('POST error', err),
        });
      }
    }
  
    // -----------------------------
    // DELETE
    // -----------------------------
    deleteActivity(index: number): void {
      const id = this.volunteers[index]?.AcademicId;
      if (!id) return;
  
      this.api.deleteAcademic(id).subscribe({
        next: () => this.loadActivities(),
        error: (err: any) => console.error('DELETE error', err),
      });
    }
  
    // -----------------------------
    // EDIT (ใส่ค่ากลับเข้า form)
    // -----------------------------
    editActivity(index: number): void {
      this.openPopup();
      const selected = this.volunteers[index];
      if (!selected) return;
  
      this.editAcademicId = selected.AcademicId ?? null;
  
      this.name = selected.Name ?? '';
      this.place = selected.Place ?? '';
      this.date = selected.Date
        ? new Date(selected.Date).toISOString().split('T')[0]
        : '';
      this.comment = selected.Comment ?? '';
      this.detail = selected.Detail ?? '';
      this.previewImage = selected.Image ?? null;
    }
  
    // -----------------------------
    // Reset form
    // -----------------------------
    resetForm(): void {
      this.name = '';
      this.place = '';
      this.date = '';
      this.comment = '';
      this.detail = '';
      this.previewImage = null;
    }
  
    clearForm(): void {
      this.resetForm();
      this.openPopup();
    }
  }
  
