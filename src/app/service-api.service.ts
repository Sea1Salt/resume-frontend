// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransAcademic {
  academicId?: number;
  userId?: number;
  name: string;
  place: string;
  date: string; // "yyyy-MM-dd" หรือ ISO string
  comment?: string;
  detail?: string;
  image?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5093/api';

  constructor(private http: HttpClient) {}

  // ✅ ใช้ HttpHeaders เสมอ
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ---------------- Auth ----------------
  login(data: { Mail: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Login/Sign-In`, data);
  }

  register(data: { Mail: string; Password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Regis/Sign-Up`, data);
  }

  // ---------------- AboutMe ----------------
  saveAboutMe(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/AboutMe/Add`, data, {
      headers: this.authHeaders()
    });
  }

  getAboutMe(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/AboutMe/Get`, {
      headers: this.authHeaders()
    });
  }

  // ---------------- Academics ----------------
  getAcademics(): Observable<TransAcademic[]> {
    return this.http.get<TransAcademic[]>(`${this.baseUrl}/Academics`, {
      headers: this.authHeaders()
    });
  }

  addAcademic(data: TransAcademic): Observable<TransAcademic> {
    return this.http.post<TransAcademic>(`${this.baseUrl}/Academics`, data, {
      headers: this.authHeaders()
    });
  }

  updateAcademic(id: number, data: TransAcademic): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Academics/${id}`, data, {
      headers: this.authHeaders()
    });
  }

  deleteAcademic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Academics/${id}`, {
      headers: this.authHeaders()
    });
  }
}
