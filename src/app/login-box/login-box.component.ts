import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-box',
  imports: [RouterLink,FormsModule],
  templateUrl: './login-box.component.html',
  styleUrl: './login-box.component.css'
})
export class LoginBoxComponent {
  email: string = '';
  password: string = '';
 
  ngOnInit(): void {
    this.email = localStorage.getItem('userEmail') || '';
    this.password = localStorage.getItem('userPassword') || '';
  }


}
