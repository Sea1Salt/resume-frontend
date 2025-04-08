import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-resume',
  imports:[CommonModule],
  standalone: true, // ✅ Add this if using Angular Standalone
  templateUrl: './my-resume.component.html',
  styleUrls: ['./my-resume.component.css']
})
export class MyResumeComponent {
  isLoggedIn: boolean = false; 
}