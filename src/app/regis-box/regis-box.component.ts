import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Usr {
  Gmail: string;
  Password: string;
}

@Component({
  selector: 'app-regis-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './regis-box.component.html',
  styleUrl: './regis-box.component.css'
})

export class RegisBoxComponent {
  gmail: string = "";
  password: string = "";
  comfirmPass: string = "";
  usrs: Usr[] = [];
  showError: any;
  showSuccess: any;

  constructor(private router: Router) { }

  savePass(): void {
    if (this.gmail.trim() !== "" && this.password.trim() !== "" && this.gmail.trim() !== "" && this.password.trim() === this.comfirmPass.trim()) {
      this.usrs.push({ Gmail: this.gmail, Password: this.password });
      this.gmail = "";
      this.password = "";
      this.comfirmPass = "";
      this.saveLocal();
      this.router.navigate(['/login-box']);

      localStorage.setItem('userEmail', this.gmail);
      localStorage.setItem('userPassword', this.password);
    }
    else {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    }
  }

  saveLocal(): void {
    localStorage.setItem("usrs", JSON.stringify(this.usrs))
    console.log('User', this.usrs)
  }




}
