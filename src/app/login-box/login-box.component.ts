import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from '../service-api.service';

@Component({
  selector: 'app-login-box',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.css']
})
export class LoginBoxComponent {
  email: string = '';
  password: string = '';
  showError: string = '';
  showSuccess: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  onLogin() {
    const loginData = {
      Mail: this.email,
      password: this.password
    };

     this.api.login(loginData).subscribe({
        next: (res: any) => {
          if (res.isAuthen) {
            localStorage.setItem('token', res.token);
            this.showSuccess = true;
            setTimeout(() => {
              this.showSuccess = false;
              this.router.navigateByUrl('/pro');
            }, 1500);
          } else {
            this.showError = 'Invalid email or password';
            setTimeout(() => this.showError = '', 3000);
          }
        },
        error: err => {
          this.showError = 'login error';
          console.error('Login error:', err);
          setTimeout(() => this.showError = '', 3000);
        }
      });
  }
}
