// 📁 src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5093/api'; // ✅ URL ของ backend

  constructor(private http: HttpClient) {}

  // 👇 Method ตัวอย่าง: Login
  login(data: { Mail: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Login/Sign-In`, data);
  }

  // 👇 Register
  register(data: { Mail: string; Password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Regis/Sign-Up`, data);
  }

  // 👇 Save Profile
  saveAboutMe(data: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/AboutMe/Add`, data, { headers });
  }

  // 👇 Get Profile
  getAboutMe(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/AboutMe/Get`, { headers });
  }
}
