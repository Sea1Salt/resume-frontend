import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AboutMe {
  firstname: string;
  lastname: string;
  nickname: string;
  birthdate: string;
  gender: string;
  address: string;
  softSkill: string;
  hardSkill: string;
  hobby: string;
  instagram: string;
  facebook: string;
  tel: string;
  motto: string;
  description: string;
  profileImage: string;
}

@Component({
  selector: 'app-about-me',
  imports: [CommonModule,FormsModule],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {
  previewUrl: string | ArrayBuffer | null = null;

onFileSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

aboutMeData: AboutMe = {
  firstname: '',
  lastname: '',
  nickname: '',
  birthdate: '',
  gender: '',
  address: '',
  softSkill: '',
  hardSkill: '',
  hobby: '',
  instagram: '',
  facebook: '',
  tel: '',
  motto: '',
  description: '',
  profileImage: '' // base64 image
};

saveLocal(): void {
  const dataString = JSON.stringify(this.aboutMeData);
  localStorage.setItem('aboutMe', dataString);
  this.loadLocal();
  console.log('✅ Data saved to localStorage',this.aboutMeData);
}

loadLocal(): void {
  const dataString = localStorage.getItem('aboutMe');
  if (dataString) {
    this.aboutMeData = JSON.parse(dataString);
    console.log('📦 Loaded from localStorage:', this.aboutMeData );
  }
}

isEditing: boolean = false;

editAboutMe(): void {
  this.isEditing = true;
  const savedData = localStorage.getItem('aboutMe');
  if (savedData) {
    this.aboutMeData = JSON.parse(savedData);
  }
}

ngOnInit(): void {
  const storedAbout = localStorage.getItem('aboutMe');
  if (storedAbout) {
    this.aboutMeData = JSON.parse(storedAbout);
    this.previewUrl = this.aboutMeData.profileImage;
  }
}
}
