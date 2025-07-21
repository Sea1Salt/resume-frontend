import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../service-api.service';

interface AboutMe {
  name: string;
  lastname: string;
  nickname: string;
  birthDate: string;
  gender: string;
  address: string;
  softskill: string;
  hardskill: string;
  hobby: string;
  instagram: string;
  facebook: string;
  telephone: string;
  motto: string;
  description: string;
  pathpicture: string;
}


@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})

export class AboutMeComponent implements OnInit {
  aboutMeData: AboutMe = {
    name: '',
    lastname: '',
    nickname: '',
    birthDate: '',
    gender: '',
    address: '',
    softskill: '',
    hardskill: '',
    hobby: '',
    instagram: '',
    facebook: '',
    telephone: '',
    motto: '',
    description: '',
    pathpicture: '',
  };
  showError: string = '';
  showSuccess: string = '';
  genders = ['Male', 'Female', 'LGBTQ+'];

  previewUrl: string | ArrayBuffer | null = null;
  isEditing: boolean = false;
  private apiUrl = 'http://localhost:5093/api/AboutMe';

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.loadFromServer();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.aboutMeData.pathpicture = this.previewUrl as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveToServer(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.api.saveAboutMe(this.aboutMeData).subscribe({
    next: (res) => {
      console.log('✅ Data saved to backend', res);
      this.showSuccess = "Save data successfully";       // แสดงข้อความสำเร็จ
      this.showError = '';           // ล้างข้อความ error ถ้ามี
      setTimeout(() => this.showSuccess = '', 3000); // ซ่อนข้อความหลัง 3 วิ
    },
    error: (err) => {
      console.error('❌ Save failed', err);
      this.showError = 'Save data unsuccessfully , Please try again';  // แสดงข้อความผิดพลาด
      this.showSuccess = '';      // ล้างข้อความ success
      setTimeout(() => this.showError = '', 3000);          // ซ่อนข้อความ error หลัง 3 วิ
    }
  });
}


  loadFromServer(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.api.getAboutMe().subscribe({
    next: (data) => {
      if (data) {
        this.aboutMeData = data;
        this.previewUrl = data.pathpicture;
        console.log('📦 Loaded from backend:', this.aboutMeData);
      }
    },
    error: (err) => {
      console.error('❌ Load failed', err);
    }
  });
}

  editAboutMe(): void {
    this.isEditing = true;
    this.loadFromServer();
  }
}
