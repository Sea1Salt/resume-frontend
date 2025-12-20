import { Routes } from '@angular/router';
import { RegisBoxComponent } from './regis-box/regis-box.component';
import { MyResumeComponent } from './my-resume/my-resume.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { ProComponent } from './pro/pro.component';
import { AcademicBoxComponent } from './academic-box/academic-box.component';
import { ActivityBoxComponent } from './activity-box/activity-box.component';
import { VolunteerBoxComponent } from './volunteer-box/volunteer-box.component';
import { AboutMeComponent } from './about-me/about-me.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login-box', pathMatch: 'full' },

  {
    path: 'login-box',
    loadComponent: () =>
      import('./login-box/login-box.component').then((m) => m.LoginBoxComponent),
  },

  { path: 'regis-box', component: RegisBoxComponent },
  { path: 'my-resume', component: MyResumeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pro', component: ProComponent },

  // ✅ ใช้ queryParams: /academic-box?activityType=1
  { path: 'academic-box', component: AcademicBoxComponent },
  { path: 'activity-box', component: ActivityBoxComponent },
  { path: 'volunteer-box', component: VolunteerBoxComponent },

  { path: 'about-me', component: AboutMeComponent },

  // กันพิมพ์ url ผิด
  { path: '**', redirectTo: 'login-box' },
];
