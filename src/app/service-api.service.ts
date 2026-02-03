// 📁 src/app/service-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

export interface TransAcademic {
  Id? : number;
  academicId?: number;
  userId?: number;
  activityType: number;
  name: string;
  place: string;
  date: string; // ✅ backend รับเป็น string yyyy-MM-dd ได้ชัวร์
  comment: string;
  detail: string;
  image?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiURL;
  // private baseUrl = 'https://Smart-Resume-api.nextgensea.com/api';

  constructor(private http: HttpClient) {}

  // ---------- AUTH ----------
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ---------- LOGIN / REGISTER ----------
  login(data: { Mail: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}Login/Sign-In`, data);
  }

  register(data: { Mail: string; Password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}Regis/Sign-Up`, data);
  }

  // ---------- ABOUT ME ----------
  saveAboutMe(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}AboutMe/Add`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getAboutMe(): Observable<any> {
    return this.http.get(`${this.baseUrl}AboutMe/Get`, {
      headers: this.getAuthHeaders()
    });
  }

  // ---------- ACADEMICS ----------
  getAcademics(activityType?: number) {
  const url =
    activityType ? `${this.baseUrl}academics/AcademicsAll?activityType=${activityType}` : `${this.baseUrl}/academics/AcademicsItem`;

  return this.http.get<any[]>(url, { headers: this.getAuthHeaders() });
}


  addAcademic(data: TransAcademic): Observable<any> {
    return this.http.post(`${this.baseUrl}Academics/AcademicsAdd`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateAcademic(data: TransAcademic): Observable<any> {
    return this.http.post(`${this.baseUrl}Academics/AcademicsUpdate`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAcademic(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}Academics/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
