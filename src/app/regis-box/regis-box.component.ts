import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../service-api.service';

interface RegisData {
  Mail: string;
  Password: string;
}

@Component({
  selector: 'app-regis-box',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './regis-box.component.html',
  styleUrls: ['./regis-box.component.css'],
})
export class RegisBoxComponent {
  gmail: string = '';
  password: string = '';
  comfirmPass: string = '';
  showError: string = '';
  showSuccess: boolean = false;

  constructor(private router: Router, private api: ApiService) {}

  savePass(): void {
    if (
      this.gmail.trim() !== '' &&
      this.password.trim() !== '' &&
      this.password.trim() === this.comfirmPass.trim()
    ) {
      const userData: RegisData = {
        Mail: this.gmail,
        Password: this.password,
      };

      this.api.register(userData).subscribe({
        next: (res) => {
          if (res === true) {
            this.showSuccess = true;
            setTimeout(() => {
              this.showSuccess = false;
              this.router.navigate(['/login-box']);
            }, 2000);
          } else if (typeof res === 'object' && res.message) {
            if (res.message === 'E-mail is already exist') {
              this.showError = 'E-mail is already exist';
            } else if (res.message === 'Password is already used') {
              this.showError = 'Password is already used';
            } else {
              this.showError = res.message;
            }
            setTimeout(() => (this.showError = ''), 3000);
          } else {
            this.showError = 'Fail registration';
            setTimeout(() => (this.showError = ''), 3000);
          }
          if (this.gmail.length > 50) {
            this.showError = 'E-mail must not exceed 50 characters.';
            return;
          }

          if (this.password.length > 50) {
            this.showError = 'Password must not exceed 50 characters.';
            return;
          }
        },
        error: (err) => {
          console.error('❌ Registration error:', err);

          if (err.status === 500) {
            // ถ้ามีข้อความจาก backend แสดงมัน
            this.showError = 'Registration error';
          } else {
            // กรณี error อื่น ๆ เช่น 400, 404
            this.showError = 'Registration error';
          }

          setTimeout(() => (this.showError = ''), 3000);
        },
      });
    } else {
      this.showError = 'Invalid input or password mismatch.';
      setTimeout(() => (this.showError = ''), 3000);
    }
  }
}
