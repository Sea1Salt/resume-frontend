import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes'; // หรือไฟล์ routes ของคุณ

export const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),   // ✅ เพิ่มตัวนี้เพื่อให้ HttpClient ใช้งานได้
    // ...providers อื่น ๆ ที่คุณมี
  ]
};
