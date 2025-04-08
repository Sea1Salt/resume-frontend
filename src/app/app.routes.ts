import { Routes } from '@angular/router';
import { LoginBoxComponent } from './login-box/login-box.component';
import { RegisBoxComponent } from './regis-box/regis-box.component';
import { MyResumeComponent } from './my-resume/my-resume.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { ProComponent } from './pro/pro.component';
import { AcademicBoxComponent } from './academic-box/academic-box.component';


export const routes: Routes = [
    {
        path:'',
        redirectTo: 'login-box',
        pathMatch:'full'

    },
    {
        path:"login-box",
        component:LoginBoxComponent
    },  
    {
        path:"regis-box",
        component:RegisBoxComponent
    },
    {
        path:"my-resume",
        component:MyResumeComponent
    },
    {
        path:"profile",
        component:ProfileComponent
    },
    {
        path:"about",
        component:AboutComponent
    },
    {
        path:"pro",
        component:ProComponent
    },
    {
        path:"academic-box",
        component:AcademicBoxComponent
    },
    



];
